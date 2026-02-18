class ClassCredit < ApplicationRecord
  # Associations
  belongs_to :student
  belongs_to :batch

  # Validations
  validates :credits, presence: true, numericality: { greater_than: 0 }
  validates :used_credits, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :amount_paid, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :purchase_date, presence: true
  validate :used_credits_not_greater_than_credits
  validate :expiry_date_after_purchase_date

  # Scopes
  scope :active, -> { where('expiry_date IS NULL OR expiry_date > ?', Time.current) }
  scope :expired, -> { where('expiry_date <= ?', Time.current) }
  scope :for_student, ->(student_id) { where(student_id: student_id) }
  scope :for_batch, ->(batch_id) { where(batch_id: batch_id) }

  # Callbacks
  before_save :ensure_purchase_date

  # Instance methods
  def remaining_credits
    credits - used_credits
  end

  def expired?
    expiry_date.present? && expiry_date <= Time.current
  end

  def active?
    !expired? && remaining_credits > 0
  end

  # Use one credit (called when student attends a class)
  def use_credit!
    return false if remaining_credits <= 0 || expired?

    increment!(:used_credits)
    true
  end

  # Refund one credit (called when attendance is marked as absent or cancelled)
  def refund_credit!
    return false if used_credits <= 0

    decrement!(:used_credits)
    true
  end

  # Calculate per-class rate
  def per_class_rate
    return 0 if credits.zero?
    amount_paid / credits
  end

  private

  def used_credits_not_greater_than_credits
    if used_credits.present? && credits.present? && used_credits > credits
      errors.add(:used_credits, "cannot be greater than total credits")
    end
  end

  def expiry_date_after_purchase_date
    if expiry_date.present? && purchase_date.present? && expiry_date <= purchase_date
      errors.add(:expiry_date, "must be after purchase date")
    end
  end

  def ensure_purchase_date
    self.purchase_date ||= Time.current
  end
end
