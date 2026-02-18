class UserMailer < ApplicationMailer
  # Generic templated email sender
  def send_templated_email(to:, subject:, body:)
    @body = body

    mail(
      to: to,
      subject: subject
    ) do |format|
      format.html { render inline: @body }
      format.text { render plain: strip_html(@body) }
    end
  end

  # Payment confirmation email
  def payment_confirmation(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  # Class reminder email
  def class_reminder(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  # Enrollment confirmation email
  def enrollment_confirmation(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  # Payment reminder email
  def payment_reminder(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  # Credit purchase confirmation email
  def credit_purchase(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  # Attendance summary email
  def attendance_summary(to:, subject:, body:)
    send_templated_email(to: to, subject: subject, body: body)
  end

  private

  # Strip HTML tags for plain text version
  def strip_html(html)
    html.gsub(/<[^>]*>/, '').gsub(/\s+/, ' ').strip
  end
end
