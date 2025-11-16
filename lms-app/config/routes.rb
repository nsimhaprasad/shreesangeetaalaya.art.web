Rails.application.routes.draw do
  # Devise routes for user authentication
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  # Root path - redirects to role-specific dashboard
  root "dashboard#index"

  # Main dashboard route
  get "dashboard", to: "dashboard#index"

  # Admin namespace routes
  namespace :admin do
    resources :students
    resources :teachers
    resources :courses
    resources :batches do
      resources :batch_enrollments, only: [:create, :destroy]
    end
    resources :payments
    resources :attendances
    resources :learning_resources do
      resources :resource_assignments, only: [:create, :destroy]
    end
    resources :fee_structures
    resources :fee_offers
    resources :class_sessions
  end

  # Teacher namespace routes
  namespace :teacher do
    resources :students, only: [:index, :show]
    resources :batches, only: [:index, :show]
    resources :attendances, only: [:index] do
      collection do
        get :mark
        post :mark, action: :create_attendance
      end
    end
    resources :learning_resources
    resources :class_sessions
  end

  # Student namespace routes
  namespace :student do
    get "dashboard", to: "dashboard#index"
    resources :courses, only: [:index, :show]
    resources :batches, only: [:index, :show]
    resources :attendances, only: [:index]
    resources :learning_resources, only: [:index, :show]
    resources :payments, only: [:index, :show, :new, :create]
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
