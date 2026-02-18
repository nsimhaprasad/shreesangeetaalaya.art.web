class Student::AttendancesController < ApplicationController
  before_action :authenticate_student!

  def index
    student = current_user.student
    batches = student.batches.includes(:course)

    # Get all attendances for the student
    attendances = student.attendances
      .includes(:class_session)
      .order('class_sessions.class_date DESC')

    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    end

    # Get recent attendance records
    recent_attendances = attendances.limit(20).map do |attendance|
      {
        id: attendance.id,
        date: attendance.class_session.class_date,
        batch_name: attendance.class_session.batch.name,
        course_name: attendance.class_session.batch.course.name,
        status: attendance.status,
        notes: attendance.notes,
        marked_at: attendance.marked_at
      }
    end

    # Calculate overall statistics
    total_classes = attendances.count
    present_count = attendances.where(status: 'present').count
    absent_count = attendances.where(status: 'absent').count
    late_count = attendances.where(status: 'late').count
    excused_count = attendances.where(status: 'excused').count
    attendance_percentage = total_classes > 0 ? (present_count.to_f / total_classes * 100).round(2) : 0

    stats = {
      total_classes: total_classes,
      present: present_count,
      absent: absent_count,
      late: late_count,
      excused: excused_count,
      attendance_percentage: attendance_percentage
    }

    render inertia: 'Student/Attendance/Index', props: {
      batches: batches_data,
      recent_attendances: recent_attendances,
      stats: stats
    }
  end

  def calendar
    student = current_user.student
    batch_id = params[:batch_id]
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    batches = student.batches.includes(:course)
    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    end

    calendar_data = []

    if batch_id.present?
      batch = student.batches.find(batch_id)

      # Get all class sessions for the batch in the date range
      class_sessions = batch.class_sessions
        .where(class_date: start_date..end_date)
        .includes(:attendances)
        .order(:class_date)

      calendar_data = class_sessions.map do |session|
        attendance = session.attendances.find_by(student_id: student.id)

        {
          date: session.class_date,
          class_time: session.class_time,
          status: attendance&.status || 'not_marked',
          notes: attendance&.notes,
          marked_at: attendance&.marked_at
        }
      end
    end

    render inertia: 'Student/Attendance/Calendar', props: {
      batches: batches_data,
      selected_batch_id: batch_id,
      calendar_data: calendar_data,
      start_date: start_date.to_s,
      end_date: end_date.to_s
    }
  end

  def summary
    student = current_user.student
    batch_id = params[:batch_id]
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    batches = student.batches.includes(:course)
    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    end

    summary_data = []

    if batch_id.present?
      batch = student.batches.find(batch_id)

      attendances = student.attendances
        .joins(:class_session)
        .where(class_sessions: { batch_id: batch.id, class_date: start_date..end_date })

      total_classes = batch.class_sessions.where(class_date: start_date..end_date).count
      total_marked = attendances.count
      present_count = attendances.where(status: 'present').count
      absent_count = attendances.where(status: 'absent').count
      late_count = attendances.where(status: 'late').count
      excused_count = attendances.where(status: 'excused').count

      summary_data = {
        batch_name: batch.name,
        course_name: batch.course.name,
        total_classes: total_classes,
        total_marked: total_marked,
        present: present_count,
        absent: absent_count,
        late: late_count,
        excused: excused_count,
        attendance_percentage: total_marked > 0 ? (present_count.to_f / total_marked * 100).round(2) : 0,
        not_marked: total_classes - total_marked
      }
    end

    render json: {
      batches: batches_data,
      summary: summary_data,
      start_date: start_date.to_s,
      end_date: end_date.to_s
    }
  end

  private

  def authenticate_student!
    unless current_user&.role == 'student'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
