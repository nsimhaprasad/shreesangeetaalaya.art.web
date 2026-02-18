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

  # Zoom meeting methods
  def has_zoom_meeting?
    zoom_meeting_id.present? && is_online?
  end

  def zoom_meeting_details
    return nil unless has_zoom_meeting?

    {
      meeting_id: zoom_meeting_id,
      join_url: zoom_join_url,
      password: zoom_password,
      is_online: is_online
    }
  end

  def scheduled_at
    # Combine class_date and class_time into a datetime
    Time.zone.parse("#{class_date} #{class_time}")
  end

  def duration
    duration_minutes || 60
  end

  def create_zoom_meeting!
    return if has_zoom_meeting?

    zoom_service = ZoomService.new
    meeting = zoom_service.create_meeting(
      topic: "#{batch.course.name} - #{topic || 'Class'}",
      start_time: scheduled_at,
      duration: duration,
      password: SecureRandom.random_number(1000000).to_s.rjust(6, '0')
    )

    if meeting
      update!(
        zoom_meeting_id: meeting['id'],
        zoom_join_url: meeting['join_url'],
        zoom_start_url: meeting['start_url'],
        zoom_password: meeting['password'],
        is_online: true
      )
      meeting
    else
      nil
    end
  end

  def delete_zoom_meeting!
    return unless has_zoom_meeting?

    zoom_service = ZoomService.new
    zoom_service.delete_meeting(zoom_meeting_id)
    
    update!(
      zoom_meeting_id: nil,
      zoom_join_url: nil,
      zoom_start_url: nil,
      zoom_password: nil,
      is_online: false
    )
  end
end
