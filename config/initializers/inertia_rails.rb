# frozen_string_literal: true

InertiaRails.configure do |config|
  # Set the version to bust client-side cache
  config.version = Rails.env.production? ? Time.current.to_i.to_s : '1.0'

  # Specify the layout to use for Inertia responses
  config.layout = 'application'
end
