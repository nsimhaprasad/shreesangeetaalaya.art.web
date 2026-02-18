# Email Templates Seed Data

puts "Creating default email templates..."

EmailTemplate.find_or_create_by(name: EmailTemplate::PAYMENT_CONFIRMATION) do |template|
  template.subject = "Payment Confirmation - Shree Sangeetha Aalaya"
  template.body = <<~BODY
    Dear {{student_name}},

    Thank you for your payment!

    We have successfully received your payment of {{amount}} for {{quantity}} {{purchase_type}}.

    Transaction Details:
    - Amount: {{amount}}
    - Quantity: {{quantity}} classes
    - Purchase Type: {{purchase_type}}
    - Transaction ID: {{transaction_id}}
    - Date: {{date}}

    Your credits have been added to your account and you can start attending classes immediately.

    If you have any questions, please don't hesitate to contact us.

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Sent when a student completes a payment"
  template.active = true
end

EmailTemplate.find_or_create_by(name: EmailTemplate::CLASS_REMINDER) do |template|
  template.subject = "Class Reminder - {{class_name}}"
  template.body = <<~BODY
    Dear {{student_name}},

    This is a reminder for your upcoming class:

    Class Details:
    - Class: {{class_name}}
    - Date: {{class_date}}
    - Time: {{class_time}}
    - Teacher: {{teacher_name}}

    Please ensure you attend the class on time. If you cannot make it, please inform your teacher in advance.

    See you in class!

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Reminder sent before a scheduled class"
  template.active = true
end

EmailTemplate.find_or_create_by(name: EmailTemplate::ENROLLMENT_CONFIRMATION) do |template|
  template.subject = "Welcome to {{batch_name}} - Enrollment Confirmed"
  template.body = <<~BODY
    Dear {{student_name}},

    Welcome to Shree Sangeetha Aalaya!

    We're delighted to confirm your enrollment in {{batch_name}}.

    Batch Details:
    - Batch: {{batch_name}}
    - Start Date: {{start_date}}
    - Teacher: {{teacher_name}}
    - Class Type: {{class_type}}

    Your musical journey begins here! We look forward to guiding you through the beautiful world of Carnatic music.

    If you have any questions about your classes or schedule, please contact us.

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Sent when a student is enrolled in a batch"
  template.active = true
end

EmailTemplate.find_or_create_by(name: EmailTemplate::PAYMENT_REMINDER) do |template|
  template.subject = "Payment Reminder - Shree Sangeetha Aalaya"
  template.body = <<~BODY
    Dear {{student_name}},

    This is a friendly reminder that you have a pending payment of {{pending_amount}}.

    Payment Details:
    - Amount Due: {{pending_amount}}
    - Due Date: {{due_date}}

    Please make the payment at your earliest convenience to continue your classes without interruption.

    You can make payment through:
    - Cash at the center
    - UPI
    - Bank Transfer

    If you have already made the payment, please disregard this reminder.

    Thank you for your cooperation!

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Sent as a reminder for pending payments"
  template.active = true
end

EmailTemplate.find_or_create_by(name: EmailTemplate::CREDIT_PURCHASE) do |template|
  template.subject = "Class Credits Added - Shree Sangeetha Aalaya"
  template.body = <<~BODY
    Dear {{student_name}},

    Great news! Your class credits have been successfully added to your account.

    Credit Details:
    - Credits Added: {{credits}} classes
    - Batch: {{batch_name}}
    - Amount Paid: {{amount}}
    - Valid Until: {{expiry_date}}

    You can now use these credits to attend your classes. Your remaining credits will be automatically deducted after each class you attend.

    Happy learning!

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Sent when class credits are purchased"
  template.active = true
end

EmailTemplate.find_or_create_by(name: EmailTemplate::ATTENDANCE_SUMMARY) do |template|
  template.subject = "Attendance Summary - {{period_start}} to {{period_end}}"
  template.body = <<~BODY
    Dear {{student_name}},

    Here's your attendance summary for the period:

    Period: {{period_start}} to {{period_end}}

    Attendance Statistics:
    - Total Classes: {{total_classes}}
    - Classes Attended: {{attended_classes}}
    - Attendance Percentage: {{attendance_percentage}}%

    Keep up the good work! Regular attendance is key to your musical progress.

    If you have any questions about your attendance, please contact us.

    Best regards,
    Shree Sangeetha Aalaya Team
  BODY
  template.description = "Monthly attendance summary for students"
  template.active = true
end

puts "Email templates created successfully!"

# SMS Templates Seed Data

puts "Creating default SMS templates..."

SmsTemplate.find_or_create_by(name: SmsTemplate::PAYMENT_CONFIRMATION) do |template|
  template.body = "Dear {{student_name}}, Payment of {{amount}} received successfully! {{credits}} credits added to your account. Thank you! - {{school_name}}"
  template.description = "SMS sent when payment is received"
  template.active = true
end

SmsTemplate.find_or_create_by(name: SmsTemplate::CLASS_REMINDER) do |template|
  template.body = "Reminder: {{student_name}}, your {{class_name}} class is on {{class_date}} at {{class_time}}. See you soon! - Shree Sangeetha Aalaya"
  template.description = "SMS reminder before class"
  template.active = true
end

SmsTemplate.find_or_create_by(name: SmsTemplate::PAYMENT_REMINDER) do |template|
  template.body = "Dear {{student_name}}, you have a pending payment of {{amount}}. Please clear your dues to continue classes. - {{school_name}}"
  template.description = "SMS for payment reminder"
  template.active = true
end

SmsTemplate.find_or_create_by(name: SmsTemplate::CREDIT_PURCHASE) do |template|
  template.body = "Hi {{student_name}}! {{credits}} class credits ({{amount}}) added successfully. Start attending your classes. - {{school_name}}"
  template.description = "SMS when credits are purchased"
  template.active = true
end

puts "SMS templates created successfully!"
puts "All template seeds completed!"
