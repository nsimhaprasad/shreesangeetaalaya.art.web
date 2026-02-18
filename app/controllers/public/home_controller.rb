class Public::HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def index
    render inertia: 'Public/Home/Index', props: {
      signed_in: user_signed_in?,
      user_role: current_user&.role
    }
  end
end
