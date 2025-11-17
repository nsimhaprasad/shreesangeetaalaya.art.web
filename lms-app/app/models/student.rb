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

  # Validations
  validates :enrollment_date, presence: true
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
end
