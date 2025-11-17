class ApplicationMailer < ActionMailer::Base
  default from: email_address_with_name(
    ENV.fetch('EMAIL_FROM_ADDRESS', 'noreply@shreesangeetaalaya.art'),
    ENV.fetch('EMAIL_FROM_NAME', 'Shree Sangeetha Aalaya')
  )
  layout "mailer"
end
