class SmsService
  class << self
    # Send payment confirmation SMS
    def send_payment_confirmation(student_purchase)
      student = student_purchase.student
      variables = {
        student_name: student.name.split.first, # First name only for SMS brevity
        amount: format_currency(student_purchase.amount),
        credits: student_purchase.quantity,
        school_name: 'Shree Sangeetha Aalaya'
      }

      send_templated_sms(
        SmsTemplate::PAYMENT_CONFIRMATION,
        student.user.phone,
        variables
      )
    end

    # Send class reminder SMS
    def send_class_reminder(class_session, student)
      variables = {
        student_name: student.name.split.first,
        class_date: class_session.scheduled_at.strftime('%d %b'),
        class_time: class_session.scheduled_at.strftime('%I:%M %p'),
        class_name: class_session.batch.name
      }

      send_templated_sms(
        SmsTemplate::CLASS_REMINDER,
        student.user.phone,
        variables
      )
    end

    # Send payment reminder SMS
    def send_payment_reminder(student, pending_amount)
      variables = {
        student_name: student.name.split.first,
        amount: format_currency(pending_amount),
        school_name: 'Shree Sangeetha Aalaya'
      }

      send_templated_sms(
        SmsTemplate::PAYMENT_REMINDER,
        student.user.phone,
        variables
      )
    end

    # Send credit purchase confirmation SMS
    def send_credit_purchase(class_credit)
      student = class_credit.student
      variables = {
        student_name: student.name.split.first,
        credits: class_credit.credits,
        amount: format_currency(class_credit.amount_paid),
        school_name: 'Shree Sangeetha Aalaya'
      }

      send_templated_sms(
        SmsTemplate::CREDIT_PURCHASE,
        student.user.phone,
        variables
      )
    end

    # Send custom SMS
    def send_custom_sms(phone_number, message)
      return log_sms_not_configured unless sms_configured?

      # TODO: Integrate with actual SMS provider (Twilio, MSG91, etc.)
      # For now, log the SMS
      log_sms_sent(phone_number, message)

      # When ready for actual integration, uncomment and configure:
      # TwilioClient.send_sms(
      #   to: phone_number,
      #   body: message
      # )

      true
    rescue => e
      Rails.logger.error "SmsService error: #{e.message}"
      false
    end

    private

    # Core method to send templated SMS
    def send_templated_sms(template_name, phone_number, variables = {})
      return log_sms_not_configured unless sms_configured?
      return log_invalid_phone(phone_number) unless valid_phone?(phone_number)

      message = SmsTemplate.render_template(template_name, variables)
      return log_template_not_found(template_name) unless message

      # TODO: Integrate with actual SMS provider (Twilio, MSG91, etc.)
      # For now, log the SMS
      log_sms_sent(phone_number, message, variables)

      # When ready for actual integration, uncomment and configure:
      # TwilioClient.send_sms(
      #   to: phone_number,
      #   body: message
      # )

      true
    rescue => e
      Rails.logger.error "SmsService error: #{e.message}"
      false
    end

    def sms_configured?
      # Check if SMS configuration exists
      # For now, always return true to allow logging
      true
    end

    def valid_phone?(phone_number)
      phone_number.present? && phone_number.to_s.length >= 10
    end

    def log_sms_sent(phone_number, message, variables = {})
      Rails.logger.info "=" * 80
      Rails.logger.info "SMS SENT (Stub - Configure SMS provider for actual delivery)"
      Rails.logger.info "To: #{phone_number}"
      Rails.logger.info "Message: #{message}"
      Rails.logger.info "Message Length: #{message.length} characters"
      Rails.logger.info "Variables: #{variables.inspect}" if variables.any?
      Rails.logger.info "=" * 80
    end

    def log_sms_not_configured
      Rails.logger.warn "SMS not configured. Skipping SMS send."
      false
    end

    def log_template_not_found(template_name)
      Rails.logger.error "SMS template '#{template_name}' not found or inactive"
      false
    end

    def log_invalid_phone(phone_number)
      Rails.logger.error "Invalid phone number: #{phone_number}"
      false
    end

    def format_currency(amount)
      "Rs.#{amount.to_f.round(0)}"
    end
  end
end
