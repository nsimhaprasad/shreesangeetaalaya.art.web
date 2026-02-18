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

    # Send referral reward SMS
    def send_referral_reward(referral)
      student = referral.referrer
      variables = {
        student_name: student.name.split.first,
        referred_name: referral.referred_student.name.split.first,
        reward: referral.reward_display,
        school_name: 'Shree Sangeetha Aalaya'
      }

      send_templated_sms(
        'referral_reward',  # Will add this template
        student.user.phone,
        variables
      )
    end

    # Send custom SMS
    def send_custom_sms(phone_number, message)
      return log_sms_not_configured unless sms_configured?
      return log_invalid_phone(phone_number) unless valid_phone?(phone_number)

      # Log the SMS
      log_sms_sent(phone_number, message)

      # Send actual SMS if SMS delivery is enabled
      if sms_delivery_enabled?
        send_via_provider(phone_number, message)
      else
        Rails.logger.info "SMS delivery disabled. SMS logged only."
        true
      end
    rescue => e
      Rails.logger.error "SmsService error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      false
    end

    private

    # Core method to send templated SMS
    def send_templated_sms(template_name, phone_number, variables = {})
      return log_sms_not_configured unless sms_configured?
      return log_invalid_phone(phone_number) unless valid_phone?(phone_number)

      message = SmsTemplate.render_template(template_name, variables)
      return log_template_not_found(template_name) unless message

      # Log the SMS for debugging
      log_sms_sent(phone_number, message, variables)

      # Send actual SMS if SMS delivery is enabled
      if sms_delivery_enabled?
        result = send_via_provider(phone_number, message)
        if result
          Rails.logger.info "SMS sent successfully to #{phone_number}"
        else
          Rails.logger.error "SMS failed to send to #{phone_number}"
        end
        result
      else
        Rails.logger.info "SMS delivery disabled. SMS logged only."
        true
      end
    rescue => e
      Rails.logger.error "SmsService error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      false
    end

    def sms_configured?
      # Check if SMS configuration exists
      # Always return true to allow logging even if delivery is disabled
      true
    end

    def sms_delivery_enabled?
      # Check if SMS delivery is enabled via environment variable
      # Set SMS_DELIVERY_ENABLED=true in .env to enable actual SMS sending
      ENV.fetch('SMS_DELIVERY_ENABLED', 'false').downcase == 'true'
    end

    def send_via_provider(phone_number, message)
      provider = ENV.fetch('SMS_PROVIDER', 'msg91').downcase

      case provider
      when 'twilio'
        Sms::TwilioClient.send_sms(to: phone_number, message: message)
      when 'msg91'
        Sms::Msg91Client.send_sms(to: phone_number, message: message)
      else
        Rails.logger.error "Unknown SMS provider: #{provider}"
        false
      end
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
