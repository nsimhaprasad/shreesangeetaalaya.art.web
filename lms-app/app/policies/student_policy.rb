class StudentPolicy < ApplicationPolicy
  def index?
    user.teacher? || user.admin?
  end

  def show?
    user.teacher? || user.admin? || (user.student? && record.user_id == user.id)
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
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      elsif user.teacher?
        # Teachers can see students enrolled in their batches
        scope.joins(batches: :teacher).where(batches: { teacher_id: user.teacher.id }).distinct
      elsif user.student?
        # Students can only see themselves
        scope.where(user_id: user.id)
      else
        scope.none
      end
    end
  end
end
