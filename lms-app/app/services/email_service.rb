class EmailService
  class << self
    # Send payment confirmation email
    def send_payment_confirmation(student_purchase)
      student = student_purchase.student
      variables = {
        student_name: student.name,
        amount: format_currency(student_purchase.amount),
        quantity: student_purchase.quantity,
        purchase_type: student_purchase.purchase_type.humanize,
        transaction_id: student_purchase.transaction_id || 'N/A',
        date: student_purchase.created_at.strftime('%d %b %Y')
      }

      send_templated_email(
        EmailTemplate::PAYMENT_CONFIRMATION,
        student.user.email,
        variables
      )
    end

    # Send class reminder email
    def send_class_reminder(class_session, student)
      variables = {
        student_name: student.name,
        class_name: class_session.batch.name,
        class_date: class_session.scheduled_at.strftime('%d %b %Y'),
        class_time: class_session.scheduled_at.strftime('%I:%M %p'),
        teacher_name: class_session.batch.teacher.user.full_name
      }

      send_templated_email(
        EmailTemplate::CLASS_REMINDER,
        student.user.email,
        variables
      )
    end

    # Send enrollment confirmation email
    def send_enrollment_confirmation(batch_enrollment)
      student = batch_enrollment.student
      batch = batch_enrollment.batch
      variables = {
        student_name: student.name,
        batch_name: batch.name,
        start_date: batch.start_date.strftime('%d %b %Y'),
        teacher_name: batch.teacher.user.full_name,
        class_type: batch.class_type.humanize
      }

      send_templated_email(
        EmailTemplate::ENROLLMENT_CONFIRMATION,
        student.user.email,
        variables
      )
    end

    # Send payment reminder email
    def send_payment_reminder(student, pending_amount)
      variables = {
        student_name: student.name,
        pending_amount: format_currency(pending_amount),
        due_date: 7.days.from_now.strftime('%d %b %Y')
      }

      send_templated_email(
        EmailTemplate::PAYMENT_REMINDER,
        student.user.email,
        variables
      )
    end

    # Send credit purchase confirmation
    def send_credit_purchase(class_credit)
      student = class_credit.student
      variables = {
        student_name: student.name,
        credits: class_credit.credits,
        batch_name: class_credit.batch.name,
        amount: format_currency(class_credit.amount_paid),
        expiry_date: class_credit.expiry_date ? class_credit.expiry_date.strftime('%d %b %Y') : 'No expiry'
      }

      send_templated_email(
        EmailTemplate::CREDIT_PURCHASE,
        student.user.email,
        variables
      )
    end

    # Send attendance summary email
    def send_attendance_summary(student, period_start, period_end)
      total_classes = student.attendances.where(created_at: period_start..period_end).count
      attended = student.attendances.where(created_at: period_start..period_end, status: 'present').count

      variables = {
        student_name: student.name,
        period_start: period_start.strftime('%d %b %Y'),
        period_end: period_end.strftime('%d %b %Y'),
        total_classes: total_classes,
        attended_classes: attended,
        attendance_percentage: total_classes > 0 ? ((attended.to_f / total_classes) * 100).round(2) : 0
      }

      send_templated_email(
        EmailTemplate::ATTENDANCE_SUMMARY,
        student.user.email,
        variables
      )
    end

    # Send referral reward notification
    def send_referral_reward(referral)
      student = referral.referrer
      referred = referral.referred_student

      variables = {
        student_name: student.name,
        referred_student_name: referred.name,
        reward_type: referral.reward_display,
        reward_amount: format_currency(referral.reward_amount),
        date: referral.rewarded_at&.strftime('%d %b %Y') || Date.today.strftime('%d %b %Y')
      }

      send_templated_email(
        'referral_reward',  # Will add this template
        student.user.email,
        variables
      )
    end

    private

    # Core method to send templated email
    def send_templated_email(template_name, to_email, variables = {})
      return log_email_not_configured unless email_configured?

      template_content = EmailTemplate.render_template(template_name, variables)
      return log_template_not_found(template_name) unless template_content

      # Log the email for debugging
      log_email_sent(to_email, template_content, variables)

      # Send actual email if email delivery is enabled
      if email_delivery_enabled?
        UserMailer.send_templated_email(
          to: to_email,
          subject: template_content[:subject],
          body: template_content[:body]
        ).deliver_later
        Rails.logger.info "Email queued for delivery to #{to_email}"
      else
        Rails.logger.info "Email delivery disabled. Email logged only."
      end

      true
    rescue => e
      Rails.logger.error "EmailService error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      false
    end

    def email_configured?
      # Check if email configuration exists
      # Always return true to allow logging even if delivery is disabled
      true
    end

    def email_delivery_enabled?
      # Check if email delivery is enabled via environment variable
      # Set EMAIL_DELIVERY_ENABLED=true in .env to enable actual email sending
      ENV.fetch('EMAIL_DELIVERY_ENABLED', 'false').downcase == 'true'
    end

    def log_email_sent(to_email, content, variables)
      Rails.logger.info "=" * 80
      Rails.logger.info "EMAIL SENT (Stub - Configure email provider for actual delivery)"
      Rails.logger.info "To: #{to_email}"
      Rails.logger.info "Subject: #{content[:subject]}"
      Rails.logger.info "Body: #{content[:body]}"
      Rails.logger.info "Variables: #{variables.inspect}"
      Rails.logger.info "=" * 80
    end

    def log_email_not_configured
      Rails.logger.warn "Email not configured. Skipping email send."
      false
    end

    def log_template_not_found(template_name)
      Rails.logger.error "Email template '#{template_name}' not found or inactive"
      false
    end

    def format_currency(amount)
      "₹#{amount.to_f.round(2)}"
    end
  end
end
