class Teacher::AttendancesController < ApplicationController
  before_action :authenticate_teacher!

  def index
    teacher = current_user.teacher
    batches = teacher.batches.includes(:course)

    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        student_count: batch.students.count
      }
    end

    render inertia: 'Teacher/Attendances/Index', props: { batches: batches_data }
  end

  def mark
    # This would typically receive a batch_id and date, then allow marking attendance
    batch = current_user.teacher.batches.find(params[:batch_id])

    students_data = batch.students.map do |student|
      {
        id: student.id,
        name: student.name,
        email: student.user&.email
      }
    end

    render inertia: 'Teacher/Attendances/Mark', props: {
      batch: {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      },
      students: students_data,
      date: params[:date] || Date.today
    }
  end

  private

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
