class Admin::SmsTemplatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_sms_template, only: [:show, :edit, :update, :destroy, :toggle_active]

  def index
    @sms_templates = SmsTemplate.all.order(created_at: :desc)

    render inertia: 'Admin/SmsTemplates/Index', props: {
      sms_templates: @sms_templates.as_json(only: [:id, :name, :body, :description, :active, :created_at, :updated_at]),
      max_sms_length: SmsTemplate::MAX_SMS_LENGTH
    }
  end

  def show
    render inertia: 'Admin/SmsTemplates/Show', props: {
      sms_template: @sms_template.as_json
    }
  end

  def new
    @sms_template = SmsTemplate.new

    render inertia: 'Admin/SmsTemplates/Form', props: {
      sms_template: @sms_template.as_json,
      available_variables: available_variables,
      max_sms_length: SmsTemplate::MAX_SMS_LENGTH
    }
  end

  def create
    @sms_template = SmsTemplate.new(sms_template_params)

    if @sms_template.save
      redirect_to admin_sms_templates_path, notice: 'SMS template created successfully.'
    else
      render inertia: 'Admin/SmsTemplates/Form', props: {
        sms_template: @sms_template.as_json,
        errors: @sms_template.errors.full_messages,
        available_variables: available_variables,
        max_sms_length: SmsTemplate::MAX_SMS_LENGTH
      }
    end
  end

  def edit
    render inertia: 'Admin/SmsTemplates/Form', props: {
      sms_template: @sms_template.as_json,
      available_variables: available_variables,
      max_sms_length: SmsTemplate::MAX_SMS_LENGTH
    }
  end

  def update
    if @sms_template.update(sms_template_params)
      redirect_to admin_sms_templates_path, notice: 'SMS template updated successfully.'
    else
      render inertia: 'Admin/SmsTemplates/Form', props: {
        sms_template: @sms_template.as_json,
        errors: @sms_template.errors.full_messages,
        available_variables: available_variables,
        max_sms_length: SmsTemplate::MAX_SMS_LENGTH
      }
    end
  end

  def destroy
    @sms_template.destroy
    redirect_to admin_sms_templates_path, notice: 'SMS template deleted successfully.'
  end

  def toggle_active
    @sms_template.update(active: !@sms_template.active)
    redirect_to admin_sms_templates_path, notice: "SMS template #{@sms_template.active ? 'activated' : 'deactivated'}."
  end

  def preview
    template_name = params[:template_name]
    @sms_template = SmsTemplate.find_by(name: template_name)

    if @sms_template
      # Sample variables for preview
      preview_vars = sample_variables_for_template(template_name)
      rendered = @sms_template.render(preview_vars)

      render json: {
        body: rendered,
        length: rendered.length,
        variables_used: preview_vars
      }
    else
      render json: { error: 'Template not found' }, status: :not_found
    end
  end

  private

  def set_sms_template
    @sms_template = SmsTemplate.find(params[:id])
  end

  def sms_template_params
    params.require(:sms_template).permit(:name, :body, :description, :active)
  end

  def available_variables
    {
      payment_confirmation: ['student_name', 'amount', 'credits', 'school_name'],
      class_reminder: ['student_name', 'class_date', 'class_time', 'class_name'],
      payment_reminder: ['student_name', 'amount', 'school_name'],
      credit_purchase: ['student_name', 'credits', 'amount', 'school_name']
    }
  end

  def sample_variables_for_template(template_name)
    case template_name
    when SmsTemplate::PAYMENT_CONFIRMATION
      { student_name: 'John', amount: 'Rs.5000', credits: 10, school_name: 'Shree Sangeetha Aalaya' }
    when SmsTemplate::CLASS_REMINDER
      { student_name: 'John', class_date: Date.tomorrow.strftime('%d %b'), class_time: '10:00 AM', class_name: 'Carnatic Vocal' }
    when SmsTemplate::PAYMENT_REMINDER
      { student_name: 'John', amount: 'Rs.3000', school_name: 'Shree Sangeetha Aalaya' }
    when SmsTemplate::CREDIT_PURCHASE
      { student_name: 'John', credits: 10, amount: 'Rs.5000', school_name: 'Shree Sangeetha Aalaya' }
    else
      {}
    end
  end
end
