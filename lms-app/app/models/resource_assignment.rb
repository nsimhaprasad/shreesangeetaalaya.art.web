class ResourceAssignment < ApplicationRecord
  # Enums
  enum priority: { low: 'low', medium: 'medium', high: 'high', urgent: 'urgent' }, _prefix: :priority

  # Associations
  belongs_to :learning_resource
  belongs_to :assignable, polymorphic: true
  belongs_to :assigned_by_user, class_name: 'User', foreign_key: 'assigned_by', optional: true

  # Validations
  validates :learning_resource_id, presence: true
  validates :assignable_id, presence: true
  validates :assignable_type, presence: true
  validates :learning_resource_id, uniqueness: { scope: [:assignable_id, :assignable_type], message: "already assigned to this entity" }

  # Scopes
  scope :for_student, -> { where(assignable_type: 'Student') }
  scope :for_batch, -> { where(assignable_type: 'Batch') }
  scope :for_class_session, -> { where(assignable_type: 'ClassSession') }
  scope :recent, -> { order(assigned_at: :desc) }
  scope :with_due_date, -> { where.not(due_date: nil) }
  scope :overdue, -> { where('due_date < ?', Time.current) }
  scope :upcoming, -> { where('due_date >= ?', Time.current) }
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :high_priority, -> { where(priority: ['high', 'urgent']) }

  # Callbacks
  before_validation :set_assigned_at, on: :create

  # Helper methods
  def assigned_to_student?
    assignable_type == 'Student'
  end

  def assigned_to_batch?
    assignable_type == 'Batch'
  end

  def assigned_to_class_session?
    assignable_type == 'ClassSession'
  end

  def overdue?
    due_date.present? && due_date < Time.current
  end

  def upcoming?
    due_date.present? && due_date >= Time.current
  end

  def days_until_due
    return nil unless due_date.present?
    ((due_date - Time.current) / 1.day).round
  end

  private

  def set_assigned_at
    self.assigned_at ||= Time.current
  end
end
