class LearningResourcePolicy < ApplicationPolicy
  def index?
    user.teacher? || user.admin? || user.student?
  end

  def show?
    if user.admin?
      true
    elsif user.teacher?
      # Teachers can view their own resources
      record.uploaded_by == user.id
    elsif user.student?
      # Students can view resources assigned to them or their batches
      student = user.student
      return false unless student

      # Check if resource is assigned directly to student
      direct_assignment = ResourceAssignment
        .where(learning_resource_id: record.id, assignable_type: 'Student', assignable_id: student.id)
        .exists?

      return true if direct_assignment

      # Check if resource is assigned to any of student's batches
      batch_ids = student.batch_enrollments.pluck(:batch_id)
      batch_assignment = ResourceAssignment
        .where(learning_resource_id: record.id, assignable_type: 'Batch', assignable_id: batch_ids)
        .exists?

      batch_assignment
    else
      false
    end
  end

  def create?
    user.teacher? || user.admin?
  end

  def new?
    create?
  end

  def update?
    if user.admin?
      true
    elsif user.teacher?
      record.uploaded_by == user.id
    else
      false
    end
  end

  def edit?
    update?
  end

  def destroy?
    if user.admin?
      true
    elsif user.teacher?
      record.uploaded_by == user.id
    else
      false
    end
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      elsif user.teacher?
        # Teachers can see their own resources
        scope.where(uploaded_by: user.id)
      elsif user.student?
        # Students can see resources assigned to them or their batches
        student = user.student
        return scope.none unless student

        # Get batch IDs for the student
        batch_ids = student.batch_enrollments.pluck(:batch_id)

        # Get resource IDs assigned to student or their batches
        resource_ids = ResourceAssignment
          .where("(assignable_type = 'Student' AND assignable_id = ?) OR (assignable_type = 'Batch' AND assignable_id IN (?))",
                 student.id, batch_ids)
          .pluck(:learning_resource_id)
          .uniq

        scope.where(id: resource_ids)
      else
        scope.none
      end
    end
  end
end
