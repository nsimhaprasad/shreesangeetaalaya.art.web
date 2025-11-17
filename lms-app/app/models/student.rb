class Student < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :batch_enrollments, dependent: :destroy
  has_many :batches, through: :batch_enrollments
  has_many :payments, dependent: :destroy
  has_many :attendances, dependent: :destroy
  has_many :resource_assignments, as: :assignable, dependent: :destroy
  has_many :learning_resources, through: :resource_assignments
  has_many :class_credits, dependent: :destroy
  has_many :student_purchases, dependent: :destroy

  # Referral associations
  has_many :referrals_made, class_name: 'Referral', foreign_key: 'referrer_id', dependent: :destroy
  has_many :referred_students, through: :referrals_made, source: :referred_student
  has_one :referral_received, class_name: 'Referral', foreign_key: 'referred_student_id', dependent: :destroy
  has_one :referrer, through: :referral_received, source: :referrer

  # Callbacks
  before_create :generate_referral_code

  # Validations
  validates :enrollment_date, presence: true
  validates :referral_code, uniqueness: true, allow_nil: true
  validates :guardian_phone, format: { with: /\A[\d\s\-\+\(\)]+\z/, message: "must be a valid phone number" }, allow_blank: true
  validates :guardian_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :emergency_contact, format: { with: /\A[\d\s\-\+\(\)]+\z/, message: "must be a valid phone number" }, allow_blank: true

  # Delegations
  delegate :full_name, :email, :phone, :first_name, :last_name, :date_of_birth, :address, to: :user, prefix: false, allow_nil: true

  # Scopes
  scope :active, -> { joins(:user).where(users: { status: 'active' }) }
  scope :inactive, -> { joins(:user).where(users: { status: 'inactive' }) }

  # Helper methods
  def active_enrollments
    batch_enrollments.where(status: 'active')
  end

  def active_batches
    batches.joins(:batch_enrollments).where(batch_enrollments: { status: 'active' })
  end

  def attendance_percentage
    total = attendances.count
    return 0 if total.zero?

    present = attendances.where(status: 'present').count
    ((present.to_f / total) * 100).round(2)
  end

  def payment_status
    pending_amount = payments.where(status: 'pending').sum(:amount)
    if pending_amount > 0
      'pending'
    elsif payments.where(status: 'completed').any?
      'paid'
    else
      'none'
    end
  end

  def total_paid
    payments.where(status: 'completed').sum(:amount)
  end

  def pending_payments
    payments.where(status: 'pending').sum(:amount)
  end

  def last_payment_date
    payments.order(created_at: :desc).first&.created_at
  end

  # Get name from user or fallback
  def name
    user&.full_name || "Student ##{id}"
  end

  # Credit-related methods
  def total_credits
    class_credits.active.sum(:credits)
  end

  def total_used_credits
    class_credits.active.sum(:used_credits)
  end

  def remaining_credits
    total_credits - total_used_credits
  end

  def credits_for_batch(batch_id)
    class_credits.active.for_batch(batch_id).sum { |cc| cc.remaining_credits }
  end

  def has_credits_for_batch?(batch_id)
    credits_for_batch(batch_id) > 0
  end

  # Referral-related methods
  def total_referrals
    referrals_made.count
  end

  def successful_referrals
    referrals_made.status_rewarded.count
  end

  def pending_referrals
    referrals_made.status_pending.count
  end

  def total_referral_rewards
    referrals_made.status_rewarded.sum(:reward_amount)
  end

  def was_referred?
    referral_received.present?
  end

  def referral_link
    return nil unless referral_code.present?
    "#{ENV['APP_URL'] || 'http://localhost:3000'}/signup?ref=#{referral_code}"
  end

  private

  def generate_referral_code
    loop do
      code = generate_random_code
      break self.referral_code = code unless Student.exists?(referral_code: code)
    end
  end

  def generate_random_code
    # Generate format: SSA-XXXXX (SSA = Shree Sangeetha Aalaya)
    "SSA#{SecureRandom.alphanumeric(5).upcase}"
  end
end
