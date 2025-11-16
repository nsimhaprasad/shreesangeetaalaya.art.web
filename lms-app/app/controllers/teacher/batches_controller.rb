class Teacher::BatchesController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_batch, only: [:show, :edit, :update, :destroy]

  def index
    teacher = current_user.teacher
    batches = teacher.batches.includes(:course, :students, :fee_structures)

    batches_data = batches.map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        class_type: batch.class_type,
        schedule: batch.schedule,
        start_date: batch.start_date,
        end_date: batch.end_date,
        student_count: batch.enrollment_count,
        max_students: batch.max_students,
        available_seats: batch.available_seats,
        status: batch.status,
        current_fee: batch.current_fee
      }
    end

    render inertia: 'Teacher/Batches/Index', props: { batches: batches_data }
  end

  def show
    batch_data = {
      id: @batch.id,
      name: @batch.name,
      course: {
        id: @batch.course.id,
        name: @batch.course.name,
        description: @batch.course.description,
        course_type: @batch.course.course_type
      },
      teacher: {
        id: @batch.teacher.id,
        name: @batch.teacher.user.full_name,
        specialization: @batch.teacher.specialization
      },
      class_type: @batch.class_type,
      schedule: @batch.schedule,
      start_date: @batch.start_date,
      end_date: @batch.end_date,
      max_students: @batch.max_students,
      enrollment_count: @batch.enrollment_count,
      available_seats: @batch.available_seats,
      status: @batch.status,
      description: @batch.description,
      students: @batch.batch_enrollments.includes(student: :user).active.map do |enrollment|
        {
          id: enrollment.student.id,
          enrollment_id: enrollment.id,
          name: enrollment.student.user.full_name,
          email: enrollment.student.user.email,
          phone: enrollment.student.user.phone,
          enrollment_date: enrollment.enrollment_date,
          status: enrollment.status
        }
      end,
      upcoming_sessions: @batch.class_sessions.upcoming.limit(5).map do |session|
        {
          id: session.id,
          class_date: session.class_date,
          class_time: session.class_time,
          duration_minutes: session.duration_minutes,
          topic: session.topic,
          status: session.status
        }
      end,
      fee_structure: @batch.fee_structures.current.first&.then do |fee|
        {
          id: fee.id,
          amount: fee.amount,
          fee_type: fee.fee_type,
          effective_from: fee.effective_from
        }
      end
    }

    render inertia: 'Teacher/Batches/Show', props: { batch: batch_data }
  end

  def new
    courses = Course.active.map { |c| { value: c.id, label: c.name, course_type: c.course_type } }

    render inertia: 'Teacher/Batches/Form', props: {
      batch: nil,
      courses: courses,
      is_edit: false
    }
  end

  def create
    @batch = current_user.teacher.batches.build(batch_params)

    if @batch.save
      redirect_to teacher_batch_path(@batch), notice: 'Batch created successfully.'
    else
      courses = Course.active.map { |c| { value: c.id, label: c.name, course_type: c.course_type } }

      render inertia: 'Teacher/Batches/Form', props: {
        batch: @batch.as_json.merge(errors: @batch.errors.full_messages),
        courses: courses,
        is_edit: false
      }
    end
  end

  def edit
    courses = Course.active.map { |c| { value: c.id, label: c.name, course_type: c.course_type } }

    render inertia: 'Teacher/Batches/Form', props: {
      batch: @batch.as_json,
      courses: courses,
      is_edit: true
    }
  end

  def update
    if @batch.update(batch_params)
      redirect_to teacher_batch_path(@batch), notice: 'Batch updated successfully.'
    else
      courses = Course.active.map { |c| { value: c.id, label: c.name, course_type: c.course_type } }

      render inertia: 'Teacher/Batches/Form', props: {
        batch: @batch.as_json.merge(errors: @batch.errors.full_messages),
        courses: courses,
        is_edit: true
      }
    end
  end

  def destroy
    @batch.destroy
    redirect_to teacher_batches_path, notice: 'Batch deleted successfully.'
  end

  private

  def set_batch
    @batch = current_user.teacher.batches.find(params[:id])
  end

  def batch_params
    params.require(:batch).permit(
      :name,
      :course_id,
      :class_type,
      :schedule,
      :start_date,
      :end_date,
      :max_students,
      :status,
      :description
    )
  end

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
