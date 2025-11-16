class Teacher::AttendancesController < ApplicationController
  before_action :authenticate_teacher!

  def index
    teacher = current_user.teacher
    batches = teacher.batches.includes(:course, :students)

    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        student_count: batch.students.count
      }
    end

    render inertia: 'Teacher/Attendance/Index', props: { batches: batches_data }
  end

  def mark_attendance
    teacher = current_user.teacher
    batch_id = params[:batch_id]
    date = params[:date] || Date.today.to_s

    if batch_id.blank?
      batches = teacher.batches.includes(:course)
      batches_data = batches.map do |batch|
        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name,
          student_count: batch.students.count
        }
      end

      return render inertia: 'Teacher/Attendance/MarkAttendance', props: {
        batches: batches_data,
        selected_date: date
      }
    end

    batch = teacher.batches.includes(:students, :class_sessions).find(batch_id)

    # Find or create class session for the date
    class_session = batch.class_sessions.find_by(class_date: date)

    students_data = batch.students.map do |student|
      attendance = class_session&.attendances&.find_by(student_id: student.id)

      {
        id: student.id,
        name: student.full_name,
        email: student.email,
        attendance: attendance ? {
          id: attendance.id,
          status: attendance.status,
          notes: attendance.notes,
          marked_at: attendance.marked_at
        } : nil
      }
    end

    render inertia: 'Teacher/Attendance/MarkAttendance', props: {
      batch: {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      },
      class_session: class_session ? {
        id: class_session.id,
        class_date: class_session.class_date,
        class_time: class_session.class_time,
        status: class_session.status
      } : nil,
      students: students_data,
      selected_date: date
    }
  end

  def bulk_mark
    teacher = current_user.teacher
    batch_id = params[:batch_id]
    date = params[:date] || Date.today.to_s
    attendance_data = params[:attendance_data] || []

    batch = teacher.batches.find(batch_id)

    # Find or create class session
    class_session = batch.class_sessions.find_or_create_by!(class_date: date) do |session|
      session.class_time = Time.current.strftime('%H:%M:%S')
      session.status = 'completed'
      session.duration_minutes = 60
    end

    errors = []
    success_count = 0

    ActiveRecord::Base.transaction do
      attendance_data.each do |att_data|
        student_id = att_data[:student_id]
        status = att_data[:status]
        notes = att_data[:notes]

        # Skip if student doesn't exist in batch
        next unless batch.students.exists?(student_id)

        attendance = class_session.attendances.find_or_initialize_by(student_id: student_id)
        attendance.status = status
        attendance.notes = notes
        attendance.marked_by = current_user.id

        if attendance.save
          success_count += 1
        else
          errors << "Failed to save attendance for student #{student_id}: #{attendance.errors.full_messages.join(', ')}"
        end
      end
    end

    if errors.empty?
      render json: {
        success: true,
        message: "Successfully marked attendance for #{success_count} students",
        count: success_count
      }
    else
      render json: {
        success: false,
        errors: errors,
        count: success_count
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { success: false, error: 'Batch not found' }, status: :not_found
  rescue => e
    render json: { success: false, error: e.message }, status: :internal_server_error
  end

  def calendar
    teacher = current_user.teacher
    batch_id = params[:batch_id]
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    batches = teacher.batches.includes(:course)
    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    end

    calendar_data = []

    if batch_id.present?
      batch = teacher.batches.find(batch_id)
      class_sessions = batch.class_sessions
        .where(class_date: start_date..end_date)
        .includes(:attendances)

      calendar_data = class_sessions.map do |session|
        total_students = batch.students.count
        total_marked = session.attendances.count
        present_count = session.attendances.where(status: 'present').count
        absent_count = session.attendances.where(status: 'absent').count
        late_count = session.attendances.where(status: 'late').count
        excused_count = session.attendances.where(status: 'excused').count

        {
          date: session.class_date,
          class_time: session.class_time,
          status: session.status,
          total_students: total_students,
          marked: total_marked,
          present: present_count,
          absent: absent_count,
          late: late_count,
          excused: excused_count,
          attendance_percentage: total_marked > 0 ? (present_count.to_f / total_marked * 100).round(2) : 0
        }
      end
    end

    render inertia: 'Teacher/Attendance/Calendar', props: {
      batches: batches_data,
      selected_batch_id: batch_id,
      calendar_data: calendar_data,
      start_date: start_date.to_s,
      end_date: end_date.to_s
    }
  end

  def report
    teacher = current_user.teacher
    batch_id = params[:batch_id]
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    batches = teacher.batches.includes(:course)
    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    end

    report_data = []

    if batch_id.present?
      batch = teacher.batches.includes(:students).find(batch_id)

      report_data = batch.students.map do |student|
        attendances = student.attendances
          .joins(:class_session)
          .where(class_sessions: { batch_id: batch.id, class_date: start_date..end_date })

        total_classes = batch.class_sessions.where(class_date: start_date..end_date).count
        total_attended = attendances.count
        present_count = attendances.where(status: 'present').count
        absent_count = attendances.where(status: 'absent').count
        late_count = attendances.where(status: 'late').count
        excused_count = attendances.where(status: 'excused').count

        {
          student_id: student.id,
          student_name: student.full_name,
          student_email: student.email,
          total_classes: total_classes,
          total_marked: total_attended,
          present: present_count,
          absent: absent_count,
          late: late_count,
          excused: excused_count,
          attendance_percentage: total_attended > 0 ? (present_count.to_f / total_attended * 100).round(2) : 0
        }
      end
    end

    render inertia: 'Teacher/Attendance/Report', props: {
      batches: batches_data,
      selected_batch_id: batch_id,
      report_data: report_data,
      start_date: start_date.to_s,
      end_date: end_date.to_s
    }
  end

  def students_for_session
    teacher = current_user.teacher
    batch_id = params[:batch_id]
    date = params[:date] || Date.today.to_s

    batch = teacher.batches.includes(:students).find(batch_id)
    class_session = batch.class_sessions.find_by(class_date: date)

    students_data = batch.students.map do |student|
      attendance = class_session&.attendances&.find_by(student_id: student.id)

      {
        id: student.id,
        name: student.full_name,
        email: student.email,
        attendance: attendance ? {
          id: attendance.id,
          status: attendance.status,
          notes: attendance.notes
        } : nil
      }
    end

    render json: {
      students: students_data,
      class_session: class_session ? {
        id: class_session.id,
        class_date: class_session.class_date
      } : nil
    }
  end

  private

  def authenticate_teacher!
    unless current_user&.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
