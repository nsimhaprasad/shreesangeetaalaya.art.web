class Teacher::BatchesController < ApplicationController
  before_action :authenticate_teacher!

  def index
    teacher = current_user.teacher
    batches = teacher.batches.includes(:course, :students)

    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        schedule: batch.schedule,
        start_date: batch.start_date,
        end_date: batch.end_date,
        student_count: batch.students.count,
        status: batch.status
      }
    end

    render inertia: 'Teacher/Batches/Index', props: { batches: batches_data }
  end

  def show
    batch = current_user.teacher.batches.includes(:course, :students).find(params[:id])

    batch_data = {
      id: batch.id,
      name: batch.name,
      course: {
        id: batch.course.id,
        name: batch.course.name,
        description: batch.course.description
      },
      schedule: batch.schedule,
      start_date: batch.start_date,
      end_date: batch.end_date,
      status: batch.status,
      students: batch.students.map do |student|
        {
          id: student.id,
          name: student.name,
          email: student.user&.email,
          phone: student.phone,
          status: student.status
        }
      end
    }

    render inertia: 'Teacher/Batches/Show', props: { batch: batch_data }
  end

  private

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
