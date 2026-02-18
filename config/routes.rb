Rails.application.routes.draw do
  # Devise routes for user authentication
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  # Root path - redirects to role-specific dashboard
  root "dashboard#index"

  # Main dashboard route
  get "dashboard", to: "dashboard#index"

  # Public routes
  namespace :public do
    resources :gallery, only: [:index]
  end
  # Alternative public gallery route without namespace prefix
  get "gallery", to: "public/gallery#index"

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
    resources :fee_structures do
      collection do
        get :history
      end
    end
    resources :fee_offers
    resources :class_sessions
    resources :gallery, only: [:index, :update]

    # Email and SMS template management
    resources :email_templates do
      member do
        post :toggle_active
      end
      collection do
        post :preview
      end
    end
    resources :sms_templates do
      member do
        post :toggle_active
      end
      collection do
        post :preview
      end
    end

    # Reports routes
    get 'reports', to: 'reports#index'
    get 'reports/earnings', to: 'reports#earnings'
    get 'reports/attendance', to: 'reports#attendance'
    get 'reports/students', to: 'reports#students'
    get 'reports/batch_performance', to: 'reports#batch_performance'
  end

  # Teacher namespace routes
  namespace :teacher do
    resources :students
    resources :batches do
      resources :batch_enrollments, only: [:create, :destroy]
    end
    resources :attendances, only: [:index] do
      collection do
        get :mark_attendance
        post :bulk_mark
        get :calendar
        get :report
        get :students_for_session
      end
    end
    resources :learning_resources do
      resources :resource_assignments, only: [:new, :create, :destroy]
    end
    resources :fee_structures, only: [:index]
    resources :class_sessions do
      collection do
        get :new_recurring
        post :create_recurring
      end
      member do
        post :mark_attendance
        put :update_attendance
      end
      # Zoom meeting routes
      resource :zoom_meeting, only: [:create, :destroy]
    end
    resources :payments do
      member do
        get :receipt
      end
      collection do
        get :student_enrollments
        post :calculate_amount
      end
    end
    resources :gallery, only: [:index]

    # Reports routes
    get 'reports', to: 'reports#index'
  end

  # Student namespace routes
  namespace :student do
    get "dashboard", to: "dashboard#index"
    resources :courses, only: [:index, :show]
    resources :batches, only: [:index, :show]
    resources :attendances, only: [:index] do
      collection do
        get :calendar
        get :summary
      end
    end
    resources :learning_resources, only: [:index, :show]
    resources :payments, only: [:index, :show] do
      member do
        post :initiate_payment
        get :phonepe_callback
      end
      collection do
        post :phonepe_webhook
      end
    end
    resources :gallery, only: [:index]

    # Purchase and credits routes
    resources :purchases do
      member do
        post :cancel
      end
      collection do
        get :packages
        get :credits
      end
    end

    # Profile routes
    get "profile", to: "profile#show"
    get "profile/edit", to: "profile#edit"
    put "profile", to: "profile#update"

    # Schedule routes
    get "schedule", to: "schedule#index"

    # Progress routes
    get "progress", to: "progress#index"
  end

  get "robots.txt", to: "seo#robots"
  get "sitemap.xml", to: "seo#sitemap"

  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
