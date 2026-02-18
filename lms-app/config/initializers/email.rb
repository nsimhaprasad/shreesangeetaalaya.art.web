# Email Configuration
# This initializer sets up email delivery based on environment variables
# See .env.example for all available configuration options

if Rails.env.development? || Rails.env.production?
  email_provider = ENV.fetch('EMAIL_PROVIDER', 'smtp').downcase

  case email_provider
  when 'smtp'
    # Generic SMTP configuration (works with Gmail, custom SMTP servers, etc.)
    Rails.application.config.action_mailer.delivery_method = :smtp
    Rails.application.config.action_mailer.smtp_settings = {
      address: ENV.fetch('SMTP_ADDRESS', 'smtp.gmail.com'),
      port: ENV.fetch('SMTP_PORT', '587').to_i,
      domain: ENV.fetch('SMTP_DOMAIN', 'shreesangeetaalaya.art'),
      user_name: ENV['SMTP_USERNAME'],
      password: ENV['SMTP_PASSWORD'],
      authentication: ENV.fetch('SMTP_AUTHENTICATION', 'plain'),
      enable_starttls_auto: ENV.fetch('SMTP_ENABLE_STARTTLS_AUTO', 'true') == 'true'
    }

  when 'sendgrid'
    # SendGrid configuration
    Rails.application.config.action_mailer.delivery_method = :smtp
    Rails.application.config.action_mailer.smtp_settings = {
      address: 'smtp.sendgrid.net',
      port: 587,
      domain: ENV.fetch('SMTP_DOMAIN', 'shreesangeetaalaya.art'),
      user_name: 'apikey',
      password: ENV['SENDGRID_API_KEY'],
      authentication: 'plain',
      enable_starttls_auto: true
    }

  when 'mailgun'
    # Mailgun configuration
    Rails.application.config.action_mailer.delivery_method = :smtp
    Rails.application.config.action_mailer.smtp_settings = {
      address: 'smtp.mailgun.org',
      port: 587,
      domain: ENV['MAILGUN_DOMAIN'],
      user_name: "postmaster@#{ENV['MAILGUN_DOMAIN']}",
      password: ENV['MAILGUN_API_KEY'],
      authentication: 'plain',
      enable_starttls_auto: true
    }

  when 'aws_ses'
    # AWS SES configuration
    Rails.application.config.action_mailer.delivery_method = :smtp
    Rails.application.config.action_mailer.smtp_settings = {
      address: "email-smtp.#{ENV.fetch('AWS_REGION', 'us-east-1')}.amazonaws.com",
      port: 587,
      user_name: ENV['AWS_ACCESS_KEY_ID'],
      password: ENV['AWS_SECRET_ACCESS_KEY'],
      authentication: 'plain',
      enable_starttls_auto: true
    }
  end

  # Common settings for all environments
  Rails.application.config.action_mailer.perform_deliveries =
    ENV.fetch('EMAIL_DELIVERY_ENABLED', 'false').downcase == 'true'

  Rails.application.config.action_mailer.raise_delivery_errors = true
  Rails.application.config.action_mailer.default_url_options = {
    host: ENV.fetch('APP_HOST', 'localhost'),
    port: ENV.fetch('APP_PORT', '3000')
  }

  # Use :async for background delivery (default Rails behavior)
  # For production, consider using Sidekiq with deliver_later
  Rails.application.config.action_mailer.delivery_job = "ActionMailer::MailDeliveryJob"

  Rails.logger.info "=" * 80
  Rails.logger.info "Email Configuration Loaded"
  Rails.logger.info "Provider: #{email_provider}"
  Rails.logger.info "Delivery Enabled: #{Rails.application.config.action_mailer.perform_deliveries}"
  Rails.logger.info "From: #{ENV.fetch('EMAIL_FROM_ADDRESS', 'noreply@shreesangeetaalaya.art')}"
  Rails.logger.info "=" * 80
end
