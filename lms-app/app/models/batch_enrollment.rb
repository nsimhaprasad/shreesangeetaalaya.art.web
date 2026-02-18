class BatchEnrollment < ApplicationRecord
  # Enums
  enum status: { active: 'active', completed: 'completed', withdrawn: 'withdrawn', suspended: 'suspended' }

  # Associations
  belongs_to :batch
  belongs_to :student
  has_many :payments, dependent: :destroy

  # Validations
  validates :enrollment_date, presence: true
  validates :status, presence: true
  validates :student_id, uniqueness: { scope: :batch_id, message: "is already enrolled in this batch" }

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :recent, -> { order(enrollment_date: :desc) }

  # Callbacks
  before_validation :set_enrollment_date, on: :create

  private

  def set_enrollment_date
    self.enrollment_date ||= Date.today
  end
end
