class Student::ScheduleController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_student
    before_action :set_student

    def index
      # Get all batches the student is enrolled in
      batch_ids = @student.batches.pluck(:id)

      # Get all class sessions for these batches
      sessions = ClassSession
        .where(batch_id: batch_ids)
        .includes(batch: [:course, :teacher])
        .order(:date, :start_time)

      # Build sessions data
      sessions_data = sessions.map do |session|
        {
          id: session.id,
          date: session.date,
          start_time: session.start_time&.strftime('%H:%M'),
          end_time: session.end_time&.strftime('%H:%M'),
          topic: session.topic,
          notes: session.notes,
          duration: session.duration,
          batch_id: session.batch_id,
          batch_name: session.batch.name,
          course_id: session.batch.course_id,
          course_name: session.batch.course.name,
          teacher_name: session.batch.teacher&.name
        }
      end

      # Get batches data for filter
      batches_data = @student.batches.includes(:course).map do |batch|
        {
          id: batch.id,
          name: batch.name,
          course_id: batch.course_id,
          course_name: batch.course.name
        }
      end

      render inertia: 'Student/Schedule/Index', props: {
        sessions: sessions_data,
        batches: batches_data,
        current_month: Date.today.month - 1, # JavaScript months are 0-indexed
        current_year: Date.today.year
      }
    end

    private

    def ensure_student
      unless current_user.role == 'student'
        redirect_to root_path, alert: 'Access denied.'
      end
    end

    def set_student
      @student = current_user.student
    end
end
