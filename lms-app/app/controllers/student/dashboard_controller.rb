class Student::DashboardController < ApplicationController
  before_action :authenticate_student!

  def index
    redirect_to dashboard_path
  end

  private

  def authenticate_student!
    unless current_user.role == 'student'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
