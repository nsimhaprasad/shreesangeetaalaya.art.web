class Batch < ApplicationRecord
  # Enums
  enum class_type: { one_on_one: 'one_on_one', group: 'group' }, _prefix: :class
  enum status: { draft: 'draft', active: 'active', completed: 'completed', cancelled: 'cancelled' }

  # Associations
  belongs_to :course
  belongs_to :teacher
  has_many :batch_enrollments, dependent: :destroy
  has_many :students, through: :batch_enrollments
  has_many :class_sessions, dependent: :destroy
  has_many :fee_structures, dependent: :destroy
  has_many :resource_assignments, as: :assignable, dependent: :destroy
  has_many :learning_resources, through: :resource_assignments

  # Validations
  validates :name, presence: true
  validates :class_type, presence: true
  validates :status, presence: true
  validates :max_students, numericality: { greater_than: 0 }, allow_nil: true
  validates :start_date, presence: true

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :by_type, ->(type) { where(class_type: type) }
  scope :upcoming, -> { where('start_date > ?', Date.today) }
  scope :ongoing, -> { where('start_date <= ? AND (end_date IS NULL OR end_date >= ?)', Date.today, Date.today) }

  # Helper methods
  def current_fee
    fee_structures.current.first&.amount
  end

  def enrollment_count
    batch_enrollments.where(status: 'active').count
  end

  def available_seats
    return nil unless max_students
    max_students - enrollment_count
  end

  def full?
    return false unless max_students
    enrollment_count >= max_students
  end

  def active?
    status == 'active'
  end

  def ongoing?
    start_date <= Date.today && (end_date.nil? || end_date >= Date.today)
  end
end
