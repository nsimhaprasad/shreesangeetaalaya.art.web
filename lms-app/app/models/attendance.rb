class Attendance < ApplicationRecord
  # Enums
  enum status: { present: 'present', absent: 'absent', late: 'late', excused: 'excused' }

  # Associations
  belongs_to :class_session
  belongs_to :student
  belongs_to :marked_by_user, class_name: 'User', foreign_key: 'marked_by', optional: true

  # Validations
  validates :status, presence: true
  validates :student_id, uniqueness: { scope: :class_session_id, message: "attendance already marked for this session" }

  # Scopes
  scope :present, -> { where(status: 'present') }
  scope :absent, -> { where(status: 'absent') }
  scope :for_student, ->(student_id) { where(student_id: student_id) }
  scope :recent, -> { joins(:class_session).order('class_sessions.class_date DESC') }

  # Callbacks
  before_validation :set_marked_at, on: :create

  # Helper methods
  def present?
    status == 'present'
  end

  def absent?
    status == 'absent'
  end

  def late?
    status == 'late'
  end

  private

  def set_marked_at
    self.marked_at ||= Time.current
  end
end
