class Transaction < ApplicationRecord
  belongs_to :payment
  belongs_to :student

  validates :phonepe_merchant_transaction_id, presence: true, uniqueness: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true, inclusion: { in: %w[PENDING COMPLETED FAILED REFUNDED] }

  # Scopes
  scope :pending, -> { where(status: 'PENDING') }
  scope :completed, -> { where(status: 'COMPLETED') }
  scope :failed, -> { where(status: 'FAILED') }

  # Callbacks
  after_update :update_payment_status, if: :saved_change_to_status?

  private

  def update_payment_status
    case status
    when 'COMPLETED'
      payment.update!(
        status: 'completed',
        payment_date: completed_at || Time.now,
        payment_method: payment_mode || 'upi'
      )
    when 'FAILED'
      # Keep payment as pending if transaction failed
      Rails.logger.info "Transaction #{id} failed for payment #{payment_id}"
    end
  end
end
