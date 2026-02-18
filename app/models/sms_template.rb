class SmsTemplate < ApplicationRecord
  # Validations
  validates :name, presence: true, uniqueness: true
  validates :body, presence: true
  validate :body_length_within_limit

  # Scopes
  scope :active, -> { where(active: true) }

  # Template names as constants
  PAYMENT_CONFIRMATION = 'payment_confirmation'
  CLASS_REMINDER = 'class_reminder'
  PAYMENT_REMINDER = 'payment_reminder'
  CREDIT_PURCHASE = 'credit_purchase'

  # Maximum SMS length (160 characters for single SMS, 153 for multi-part)
  MAX_SMS_LENGTH = 160

  # Render template with variables
  def render(variables = {})
    rendered_body = body

    variables.each do |key, value|
      placeholder = "{{#{key}}}"
      rendered_body = rendered_body.gsub(placeholder, value.to_s)
    end

    rendered_body
  end

  # Class method to render a template by name
  def self.render_template(template_name, variables = {})
    template = active.find_by(name: template_name)
    return nil unless template

    template.render(variables)
  end

  private

  def body_length_within_limit
    if body.present? && body.length > 300
      errors.add(:body, "is too long (maximum is 300 characters for SMS templates)")
    end
  end
end
