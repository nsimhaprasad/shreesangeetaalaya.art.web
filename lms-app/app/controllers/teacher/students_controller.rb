class Teacher::StudentsController < ApplicationController
  before_action :authenticate_teacher!

  def index
    teacher = current_user.teacher
    students = teacher.students.distinct.includes(:user, batch_enrollments: :batch)

    students_data = students.map do |student|
      {
        id: student.id,
        name: student.name,
        email: student.user&.email,
        phone: student.phone,
        date_of_birth: student.date_of_birth,
        batches: student.batches.where(teacher: teacher).map { |b| b.name }.join(', '),
        status: student.status
      }
    end

    render inertia: 'Teacher/Students/Index', props: { students: students_data }
  end

  def show
    student = current_user.teacher.students.find(params[:id])

    student_data = {
      id: student.id,
      name: student.name,
      email: student.user&.email,
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      address: student.address,
      status: student.status,
      batches: student.batches.map do |batch|
        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name
        }
      end,
      attendance_records: student.attendances.order(created_at: :desc).limit(10).map do |attendance|
        {
          id: attendance.id,
          date: attendance.class_session&.scheduled_at&.to_date,
          status: attendance.status
        }
      end
    }

    render inertia: 'Teacher/Students/Show', props: { student: student_data }
  end

  private

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
