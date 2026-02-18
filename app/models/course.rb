class Course < ApplicationRecord
  # Enums
  enum course_type: { vocal: 'vocal', instrumental: 'instrumental', dance: 'dance', theory: 'theory' }
  enum status: { active: 'active', inactive: 'inactive', archived: 'archived' }

  # Associations
  has_many :batches, dependent: :destroy
  has_many :students, through: :batches

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :course_type, presence: true
  validates :status, presence: true

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :by_type, ->(type) { where(course_type: type) }

  # Helper methods
  def active?
    status == 'active'
  end

  def total_batches
    batches.count
  end

  def active_batches
    batches.where(status: 'active')
  end
end
