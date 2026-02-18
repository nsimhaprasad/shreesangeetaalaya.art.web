class Teacher::ResourceAssignmentsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_learning_resource, only: [:new, :create]
  before_action :set_resource_assignment, only: [:destroy]

  def new
    authorize ResourceAssignment
    teacher = current_user.teacher

    # Get teacher's students and batches
    students = policy_scope(Student).includes(:user).map do |student|
      {
        id: student.id,
        name: student.user&.full_name,
        email: student.user&.email
      }
    end

    batches = Batch.where(teacher: teacher).map do |batch|
      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course&.name,
        student_count: batch.students.count
      }
    end

    render inertia: 'Teacher/LearningResources/Assign', props: {
      resource: {
        id: @learning_resource.id,
        title: @learning_resource.title,
        resource_type: @learning_resource.resource_type
      },
      students: students,
      batches: batches,
      priorities: ResourceAssignment.priorities.keys,
      assignment: {
        assignable_type: 'Student',
        assignable_ids: [],
        notes: '',
        due_date: nil,
        priority: 'medium'
      }
    }
  end

  def create
    authorize ResourceAssignment

    assignable_type = params[:resource_assignment][:assignable_type]
    assignable_ids = params[:resource_assignment][:assignable_ids] || []
    notes = params[:resource_assignment][:notes]
    due_date = params[:resource_assignment][:due_date]
    priority = params[:resource_assignment][:priority]

    created_assignments = []
    errors = []

    assignable_ids.each do |assignable_id|
      assignment = ResourceAssignment.new(
        learning_resource: @learning_resource,
        assignable_type: assignable_type,
        assignable_id: assignable_id,
        assigned_by: current_user.id,
        notes: notes,
        due_date: due_date,
        priority: priority
      )

      if assignment.save
        created_assignments << assignment
      else
        errors << "Failed to assign to #{assignable_type} ##{assignable_id}: #{assignment.errors.full_messages.join(', ')}"
      end
    end

    if errors.empty?
      redirect_to teacher_learning_resource_path(@learning_resource), notice: "Resource assigned to #{created_assignments.count} #{assignable_type.downcase}(s) successfully."
    else
      redirect_to new_teacher_learning_resource_resource_assignment_path(@learning_resource), alert: errors.join('; ')
    end
  end

  def destroy
    authorize @resource_assignment

    if @resource_assignment.destroy
      redirect_to teacher_learning_resource_path(@resource_assignment.learning_resource), notice: 'Assignment removed successfully.'
    else
      redirect_to teacher_learning_resource_path(@resource_assignment.learning_resource), alert: 'Failed to remove assignment.'
    end
  end

  private

  def set_learning_resource
    @learning_resource = LearningResource.find(params[:learning_resource_id])
  end

  def set_resource_assignment
    @resource_assignment = ResourceAssignment.find(params[:id])
  end

  def authenticate_teacher!
    unless current_user&.teacher?
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
