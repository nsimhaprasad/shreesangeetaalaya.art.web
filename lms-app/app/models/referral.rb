class Referral < ApplicationRecord
  # Associations
  belongs_to :referrer, class_name: 'Student'
  belongs_to :referred_student, class_name: 'Student'
  belongs_to :qualifying_purchase, class_name: 'StudentPurchase', optional: true

  # Enums
  enum status: {
    pending: 'pending',           # Referral created, waiting for qualifying purchase
    qualified: 'qualified',       # Purchase made, qualifies for reward
    rewarded: 'rewarded',         # Reward has been given
    expired: 'expired',           # Referral expired (optional)
    cancelled: 'cancelled'        # Referral cancelled
  }, _prefix: :status

  enum reward_type: {
    free_month_group: 'free_month_group',      # 1 month free for group classes
    free_month_one_on_one: 'free_month_one_on_one'  # 1 month free (approx 4 credits) for 1-on-1
  }, _prefix: :reward

  # Validations
  validates :referral_code, presence: true
  validates :status, presence: true
  validate :referrer_cannot_be_referred_student

  # Scopes
  scope :pending, -> { where(status: 'pending') }
  scope :qualified, -> { where(status: 'qualified') }
  scope :rewarded, -> { where(status: 'rewarded') }
  scope :for_referrer, ->(student_id) { where(referrer_id: student_id) }
  scope :recent, -> { order(created_at: :desc) }

  # Class methods
  def self.create_from_code(referral_code, referred_student)
    referrer = Student.find_by(referral_code: referral_code)
    return nil unless referrer
    return nil if referrer.id == referred_student.id  # Can't refer yourself

    create(
      referrer: referrer,
      referred_student: referred_student,
      referral_code: referral_code,
      status: 'pending'
    )
  end

  # Instance methods

  # Check if a purchase qualifies for referral reward
  def qualifies_for_reward?(purchase)
    return false unless status_pending?
    return false unless purchase.student_id == referred_student_id
    return false unless purchase.status_completed?

    # Check qualification criteria based on purchase type
    case purchase.purchase_type
    when 'package_3_months', 'package_6_months', 'package_12_months'
      # Group class packages of 3+ months qualify
      true
    when 'one_on_one_credit'
      # 1-on-1 credits: need 8 or more credits
      purchase.quantity >= 8
    else
      false
    end
  end

  # Mark referral as qualified and calculate reward
  def mark_as_qualified!(purchase)
    return false unless qualifies_for_reward?(purchase)

    reward = calculate_reward(purchase)

    update!(
      status: 'qualified',
      qualifying_purchase: purchase,
      reward_type: reward[:type],
      reward_amount: reward[:amount]
    )
  end

  # Process the reward for the referrer
  def process_reward!
    return false unless status_qualified?

    # Create a free purchase for the referrer
    reward_purchase = create_reward_purchase

    if reward_purchase.persisted?
      update!(
        status: 'rewarded',
        rewarded_at: Time.current
      )

      # Send notification to referrer
      notify_referrer

      true
    else
      false
    end
  end

  # Calculate reward based on purchase
  def calculate_reward(purchase)
    case purchase.purchase_type
    when 'package_3_months', 'package_6_months', 'package_12_months'
      # Group class: 1 month free
      batch = purchase.batch
      fee_structure = batch&.current_fee
      monthly_fee = fee_structure&.amount || 3000  # Default to 3000 if no fee structure

      {
        type: 'free_month_group',
        amount: monthly_fee
      }
    when 'one_on_one_credit'
      # 1-on-1: 1 month worth (approx 4 credits)
      batch = purchase.batch || referrer.active_batches.class_one_on_one.first
      fee_structure = batch&.current_fee
      per_class_rate = fee_structure&.amount || 800  # Default to 800 if no fee structure

      {
        type: 'free_month_one_on_one',
        amount: per_class_rate * 4  # 4 credits = approx 1 month
      }
    else
      { type: nil, amount: 0 }
    end
  end

  # Friendly status for display
  def status_display
    case status
    when 'pending'
      'Pending - Waiting for purchase'
    when 'qualified'
      "Qualified - Reward: #{reward_display}"
    when 'rewarded'
      "Rewarded on #{rewarded_at&.strftime('%d %b %Y')}"
    when 'expired'
      'Expired'
    when 'cancelled'
      'Cancelled'
    end
  end

  # Friendly reward display
  def reward_display
    return 'N/A' unless reward_type && reward_amount

    case reward_type
    when 'free_month_group'
      "1 Month Free Group Classes (₹#{reward_amount.to_i})"
    when 'free_month_one_on_one'
      "4 Free Credits (₹#{reward_amount.to_i})"
    else
      "₹#{reward_amount.to_i}"
    end
  end

  private

  def referrer_cannot_be_referred_student
    if referrer_id.present? && referrer_id == referred_student_id
      errors.add(:base, "Referrer cannot be the same as referred student")
    end
  end

  def create_reward_purchase
    case reward_type
    when 'free_month_group'
      # Create a group class package purchase for referrer
      StudentPurchase.create!(
        student: referrer,
        batch: referrer.active_batches.class_group.first,  # First active group batch
        purchase_type: 'package_1_month',  # We'll add this type
        quantity: 1,
        amount: 0,  # Free!
        payment_status: 'completed',
        payment_method: 'referral_reward',
        transaction_id: "REF-#{id}",
        notes: "Referral reward for referring #{referred_student.name}"
      )
    when 'free_month_one_on_one'
      # Create credit purchase for referrer
      StudentPurchase.create!(
        student: referrer,
        batch: referrer.active_batches.class_one_on_one.first,
        purchase_type: 'one_on_one_credit',
        quantity: 4,  # 4 credits
        amount: 0,  # Free!
        payment_status: 'completed',
        payment_method: 'referral_reward',
        transaction_id: "REF-#{id}",
        notes: "Referral reward for referring #{referred_student.name}"
      )
    end
  end

  def notify_referrer
    # Send email notification
    EmailService.send_referral_reward(self)

    # Send SMS notification
    SmsService.send_referral_reward(self)
  end
end
