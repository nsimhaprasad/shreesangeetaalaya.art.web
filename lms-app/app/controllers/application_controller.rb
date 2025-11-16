class ApplicationController < ActionController::Base
  include Pundit::Authorization

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate_user!

  # Inertia error handling
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    redirect_to root_path, alert: "You are not authorized to perform this action."
  end

  # Override redirect_to to support Inertia responses
  def redirect_to(options = {}, response_options = {})
    if request.inertia?
      super(options, response_options.merge(inertia: true))
    else
      super(options, response_options)
    end
  end
end
