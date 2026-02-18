class StudentPurchase < ApplicationRecord
  # Associations
  belongs_to :student
  belongs_to :batch, optional: true

  # Enums
  enum purchase_type: {
    one_on_one_credit: 'one_on_one_credit',
    group_class: 'group_class',
    package_1_month: 'package_1_month',
    package_3_months: 'package_3_months',
    package_6_months: 'package_6_months',
    package_12_months: 'package_12_months'
  }, _prefix: :type

  enum payment_status: {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed',
    cancelled: 'cancelled'
  }, _prefix: :status

  # Validations
  validates :purchase_type, presence: true
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payment_status, presence: true

  # Scopes
  scope :completed, -> { where(payment_status: 'completed') }
  scope :pending, -> { where(payment_status: 'pending') }
  scope :for_student, ->(student_id) { where(student_id: student_id) }
  scope :recent, -> { order(created_at: :desc) }

  # Callbacks
  after_update :process_completed_payment, if: :saved_change_to_payment_status?
  after_create :send_purchase_notification

  # Instance methods
  def mark_as_completed!(payment_method: nil, transaction_id: nil)
    update!(
      payment_status: 'completed',
      payment_method: payment_method,
      transaction_id: transaction_id
    )
  end

  def mark_as_failed!(reason: nil)
    update!(
      payment_status: 'failed',
      notes: [notes, "Failed: #{reason}"].compact.join('; ')
    )
  end

  # Calculate expiry date based on purchase type
  def calculate_expiry_date
    case purchase_type
    when 'package_3_months'
      3.months.from_now
    when 'package_6_months'
      6.months.from_now
    when 'package_12_months'
      12.months.from_now
    else
      nil # No expiry for per-class purchases
    end
  end

  private

  def process_completed_payment
    return unless payment_status == 'completed'

    # Create class credits if it's a credit purchase
    if one_on_one_credit? || purchase_type.include?('package')
      create_class_credits
    end

    # Process referral rewards if this purchase qualifies
    process_referral_rewards

    # Send confirmation emails/SMS
    send_payment_confirmation
  end

  def create_class_credits
    # Find or create class credit record
    ClassCredit.create!(
      student: student,
      batch: batch || student.batch_enrollments.first&.batch,
      credits: quantity,
      used_credits: 0,
      purchase_date: Time.current,
      expiry_date: calculate_expiry_date,
      amount_paid: amount
    )
  end

  def send_payment_confirmation
    # Send email notification
    EmailService.send_payment_confirmation(self)

    # Send SMS notification
    SmsService.send_payment_confirmation(self)
  end

  def send_purchase_notification
    # Send notification to admin about new purchase
    # This can be implemented later
  end

  def process_referral_rewards
    # Check if this student was referred
    referral = student.referral_received
    return unless referral&.status_pending?

    # Check if this purchase qualifies for reward
    if referral.qualifies_for_reward?(self)
      # Mark referral as qualified
      referral.mark_as_qualified!(self)

      # Process the reward immediately
      referral.process_reward!
    end
  end
end
