class Teacher::BatchEnrollmentsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_batch

  def create
    student = Student.find(params[:student_id])

    # Check if batch is full
    if @batch.full?
      redirect_to teacher_batch_path(@batch), alert: 'Batch is full. Cannot add more students.'
      return
    end

    # Check if student is already enrolled
    if @batch.students.include?(student)
      redirect_to teacher_batch_path(@batch), alert: 'Student is already enrolled in this batch.'
      return
    end

    enrollment = @batch.batch_enrollments.build(
      student: student,
      status: 'active',
      enrollment_date: Date.today
    )

    if enrollment.save
      redirect_to teacher_batch_path(@batch), notice: 'Student enrolled successfully.'
    else
      redirect_to teacher_batch_path(@batch), alert: "Failed to enroll student: #{enrollment.errors.full_messages.join(', ')}"
    end
  end

  def destroy
    enrollment = @batch.batch_enrollments.find(params[:id])
    enrollment.update(status: 'withdrawn')

    redirect_to teacher_batch_path(@batch), notice: 'Student removed from batch.'
  end

  private

  def set_batch
    @batch = current_user.teacher.batches.find(params[:batch_id])
  end

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
