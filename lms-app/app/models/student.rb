class Student < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :batch_enrollments, dependent: :destroy
  has_many :batches, through: :batch_enrollments
  has_many :payments, dependent: :destroy
  has_many :attendances, dependent: :destroy
  has_many :resource_assignments, as: :assignable, dependent: :destroy
  has_many :learning_resources, through: :resource_assignments

  # Validations
  validates :enrollment_date, presence: true

  # Delegations
  delegate :full_name, :email, :phone, to: :user, prefix: false, allow_nil: true

  # Helper methods
  def active_enrollments
    batch_enrollments.where(status: 'active')
  end

  def active_batches
    batches.joins(:batch_enrollments).where(batch_enrollments: { status: 'active' })
  end
end
