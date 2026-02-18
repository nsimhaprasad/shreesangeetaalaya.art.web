class FeeStructure < ApplicationRecord
  # Enums
  enum class_type: { one_on_one: 'one_on_one', group: 'group' }, _prefix: :class
  enum fee_type: { monthly: 'monthly', quarterly: 'quarterly', per_class: 'per_class', package: 'package' }

  # Associations
  belongs_to :batch

  # Validations
  validates :class_type, presence: true
  validates :fee_type, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :effective_from, presence: true

  # Scopes
  scope :current, -> { where('effective_from <= ? AND (effective_to IS NULL OR effective_to >= ?)', Date.today, Date.today) }
  scope :active, -> { where('effective_to IS NULL OR effective_to >= ?', Date.today) }
  scope :by_type, ->(type) { where(fee_type: type) }

  # Helper methods
  def current?
    effective_from <= Date.today && (effective_to.nil? || effective_to >= Date.today)
  end

  def active?
    effective_to.nil? || effective_to >= Date.today
  end
end
