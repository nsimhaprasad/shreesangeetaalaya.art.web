class Teacher < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :batches, dependent: :destroy
  has_many :students, through: :batches

  # Validations
  validates :specialization, presence: true
  validates :years_of_experience, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  # Delegations
  delegate :full_name, :email, :phone, to: :user, prefix: false, allow_nil: true

  # Helper methods
  def active_batches
    batches.where(status: 'active')
  end

  def total_students
    students.distinct.count
  end
end
