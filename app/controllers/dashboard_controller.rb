class DashboardController < ApplicationController
  def index
    case current_user.role
    when 'admin'
      render_admin_dashboard
    when 'teacher'
      render_teacher_dashboard
    when 'student'
      render_student_dashboard
    else
      redirect_to new_user_session_path, alert: 'Please sign in to continue.'
    end
  end

  private

  def render_admin_dashboard
    stats = {
      total_students: Student.count,
      total_teachers: Teacher.count,
      total_courses: Course.count,
      total_batches: Batch.count,
      active_students: Student.where(status: 'active').count,
      pending_payments: Payment.where(status: 'pending').count
    }

    render inertia: 'Dashboard/Admin', props: { stats: stats }
  end

  def render_teacher_dashboard
    teacher = current_user.teacher
    batches = teacher.batches.includes(:course).map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        student_count: batch.students.count,
        schedule: batch.schedule
      }
    end

    stats = {
      total_students: teacher.students.distinct.count,
      total_batches: teacher.batches.count,
      classes_today: 0, # Can be calculated based on class_sessions
      pending_attendance: 0 # Can be calculated based on attendance records
    }

    render inertia: 'Dashboard/Teacher', props: {
      stats: stats,
      batches: batches,
      upcoming_classes: []
    }
  end

  def render_student_dashboard
    student = current_user.student
    batches = student.batches.includes(:course, :teacher).map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        teacher_name: batch.teacher.name,
        schedule: batch.schedule
      }
    end

    total_classes = Attendance.where(student: student).count
    attended_classes = Attendance.where(student: student, status: 'present').count
    attendance_percentage = total_classes > 0 ? (attended_classes.to_f / total_classes * 100).round : 0

    stats = {
      enrolled_courses: student.batches.joins(:course).select('courses.id').distinct.count,
      total_batches: student.batches.count,
      attendance_percentage: attendance_percentage,
      pending_fee: Payment.where(student: student, status: 'pending').sum(:amount)
    }

    render inertia: 'Dashboard/Student', props: {
      stats: stats,
      batches: batches,
      recent_attendance: [],
      upcoming_payments: []
    }
  end
end
