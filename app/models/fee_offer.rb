class FeeOffer < ApplicationRecord
  # Enums
  enum offer_type: { percentage_discount: 'percentage_discount', flat_discount: 'flat_discount', special_package: 'special_package' }
  enum applicable_to: { all_students: 'all_students', new_students: 'new_students', existing_students: 'existing_students' }, _prefix: :for
  enum status: { draft: 'draft', active: 'active', expired: 'expired', inactive: 'inactive' }

  # Associations
  has_many :payments, dependent: :nullify

  # Validations
  validates :name, presence: true
  validates :offer_type, presence: true
  validates :status, presence: true
  validates :valid_from, presence: true
  validates :valid_to, presence: true
  validate :validate_discount_values
  validate :valid_to_after_valid_from

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :current, -> { where('valid_from <= ? AND valid_to >= ? AND status = ?', Date.today, Date.today, 'active') }
  scope :upcoming, -> { where('valid_from > ?', Date.today) }

  # Helper methods
  def current?
    status == 'active' && valid_from <= Date.today && valid_to >= Date.today
  end

  def expired?
    valid_to < Date.today
  end

  def calculate_discount(base_amount)
    return 0 unless current?

    case offer_type
    when 'percentage_discount'
      base_amount * (discount_percentage / 100.0)
    when 'flat_discount'
      discount_amount
    else
      0
    end
  end

  private

  def validate_discount_values
    if offer_type == 'percentage_discount' && discount_percentage.blank?
      errors.add(:discount_percentage, "must be present for percentage discount")
    elsif offer_type == 'flat_discount' && discount_amount.blank?
      errors.add(:discount_amount, "must be present for flat discount")
    end
  end

  def valid_to_after_valid_from
    return if valid_from.blank? || valid_to.blank?

    if valid_to < valid_from
      errors.add(:valid_to, "must be after valid from date")
    end
  end
end
