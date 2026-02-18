class ClassSession < ApplicationRecord
  # Enums
  enum status: { scheduled: 'scheduled', completed: 'completed', cancelled: 'cancelled', rescheduled: 'rescheduled' }

  # Associations
  belongs_to :batch
  has_many :attendances, dependent: :destroy
  has_many :students, through: :attendances
  has_many :resource_assignments, as: :assignable, dependent: :destroy
  has_many :learning_resources, through: :resource_assignments

  # Validations
  validates :class_date, presence: true
  validates :class_time, presence: true
  validates :status, presence: true
  validates :duration_minutes, numericality: { greater_than: 0 }, allow_nil: true

  # Scopes
  scope :upcoming, -> { where('class_date >= ? AND status = ?', Date.today, 'scheduled').order(:class_date, :class_time) }
  scope :past, -> { where('class_date < ?', Date.today).order(class_date: :desc) }
  scope :completed, -> { where(status: 'completed') }
  scope :scheduled, -> { where(status: 'scheduled') }
  scope :for_date, ->(date) { where(class_date: date) }
  scope :for_month, ->(date) { where('class_date >= ? AND class_date <= ?', date.beginning_of_month, date.end_of_month) }

  # Helper methods
  def upcoming?
    class_date >= Date.today && status == 'scheduled'
  end

  def past?
    class_date < Date.today
  end

  def completed?
    status == 'completed'
  end

  def attendance_marked?
    attendances.any?
  end

  def attendance_percentage
    return 0 if attendances.empty?

    present_count = attendances.where(status: 'present').count
    total_count = attendances.count
    (present_count.to_f / total_count * 100).round(2)
  end
end
