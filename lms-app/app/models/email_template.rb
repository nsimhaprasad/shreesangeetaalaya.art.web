class EmailTemplate < ApplicationRecord
  # Validations
  validates :name, presence: true, uniqueness: true
  validates :subject, presence: true
  validates :body, presence: true

  # Scopes
  scope :active, -> { where(active: true) }

  # Template names as constants
  PAYMENT_CONFIRMATION = 'payment_confirmation'
  CLASS_REMINDER = 'class_reminder'
  ENROLLMENT_CONFIRMATION = 'enrollment_confirmation'
  PAYMENT_REMINDER = 'payment_reminder'
  CREDIT_PURCHASE = 'credit_purchase'
  ATTENDANCE_SUMMARY = 'attendance_summary'

  # Render template with variables
  def render(variables = {})
    rendered_subject = subject
    rendered_body = body

    variables.each do |key, value|
      placeholder = "{{#{key}}}"
      rendered_subject = rendered_subject.gsub(placeholder, value.to_s)
      rendered_body = rendered_body.gsub(placeholder, value.to_s)
    end

    {
      subject: rendered_subject,
      body: rendered_body
    }
  end

  # Class method to render a template by name
  def self.render_template(template_name, variables = {})
    template = active.find_by(name: template_name)
    return nil unless template

    template.render(variables)
  end
end
