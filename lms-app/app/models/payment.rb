class Payment < ApplicationRecord
  # Enums
  enum payment_method: { cash: 'cash', upi: 'upi', bank_transfer: 'bank_transfer', credit_card: 'credit_card', debit_card: 'debit_card', cheque: 'cheque' }
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }, _prefix: true

  # Associations
  belongs_to :student
  belongs_to :batch_enrollment
  belongs_to :fee_offer, optional: true
  belongs_to :recorded_by_user, class_name: 'User', foreign_key: 'recorded_by', optional: true
  has_many :transactions, dependent: :destroy

  # Validations
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payment_method, presence: true

  # Callbacks
  before_validation :set_default_status, on: :create

  # Scopes
  scope :recent, -> { order(payment_date: :desc) }
  scope :by_method, ->(method) { where(payment_method: method) }
  scope :for_month, ->(date) { where('payment_date >= ? AND payment_date <= ?', date.beginning_of_month, date.end_of_month) }
  scope :for_year, ->(year) { where('EXTRACT(YEAR FROM payment_date) = ?', year) }

  # Callbacks
  before_validation :set_payment_date, on: :create

  # Helper methods
  def has_offer?
    fee_offer.present?
  end

  def display_amount
    "₹#{amount.to_f.round(2)}"
  end

  private

  def set_default_status
    self.status ||= 'pending'
    self.payment_date ||= Date.today if status == 'completed'
  end
end
