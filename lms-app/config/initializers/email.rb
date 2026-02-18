# Email Configuration for Shree Sangeetha Aalaya
# Supports Brevo (free tier: 300 emails/day) and other providers

if Rails.env.development? || Rails.env.production?
  email_provider = ENV.fetch('EMAIL_PROVIDER', 'brevo').downcase
  
  case email_provider
  when 'brevo'
    Rails.application.config.action_mailer.delivery_method = :smtp
    Rails.application.config.action_mailer.smtp_settings = {
      address: 'smtp-relay.brevo.com',
      port: 587,
      domain: ENV.fetch('SMTP_DOMAIN', 'shreesangeetaalaya.art'),
      user_name: ENV.fetch('BREVO_SMTP_LOGIN', ''),
      password: ENV.fetch('BREVO_SMTP_KEY', ENV.fetch('BREVO_API_KEY', '')),
      authentication: 'login',
      enable_starttls_auto: true,
      open_timeout: 5,
      read_timeout: 5
    }

  when 'smtp'
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
  end

  Rails.application.config.action_mailer.perform_deliveries = 
    ENV.fetch('EMAIL_DELIVERY_ENABLED', Rails.env.production?.to_s).downcase == 'true'

  Rails.application.config.action_mailer.raise_delivery_errors = true
  Rails.application.config.action_mailer.default_url_options = {
    host: ENV.fetch('APP_HOST', 'localhost:3000'),
    protocol: Rails.env.production? ? 'https' : 'http'
  }

  Rails.application.config.action_mailer.delivery_job = "ActionMailer::MailDeliveryJob"

  Rails.logger.info "=" * 60
  Rails.logger.info "Email Configuration: #{email_provider.upcase}"
  Rails.logger.info "Delivery Enabled: #{Rails.application.config.action_mailer.perform_deliveries}"
  Rails.logger.info "From: #{ENV.fetch('EMAIL_FROM_ADDRESS', 'noreply@shreesangeetaalaya.art')}"
  Rails.logger.info "=" * 60
end

if Rails.env.development?
  Rails.application.config.action_mailer.delivery_method = :letter_opener
  Rails.application.config.action_mailer.perform_deliveries = true
end
