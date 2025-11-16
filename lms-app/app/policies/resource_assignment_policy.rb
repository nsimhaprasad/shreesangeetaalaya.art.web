class ResourceAssignmentPolicy < ApplicationPolicy
  def index?
    user.teacher? || user.admin?
  end

  def show?
    user.teacher? || user.admin?
  end

  def create?
    user.teacher? || user.admin?
  end

  def new?
    create?
  end

  def update?
    user.teacher? || user.admin?
  end

  def edit?
    update?
  end

  def destroy?
    user.teacher? || user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      elsif user.teacher?
        # Teachers can see assignments for their resources
        resource_ids = LearningResource.where(uploaded_by: user.id).pluck(:id)
        scope.where(learning_resource_id: resource_ids)
      else
        scope.none
      end
    end
  end
end
