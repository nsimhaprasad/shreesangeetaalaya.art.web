class Admin::EmailTemplatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_email_template, only: [:show, :edit, :update, :destroy, :toggle_active]

  def index
    @email_templates = EmailTemplate.all.order(created_at: :desc)

    render inertia: 'Admin/EmailTemplates/Index', props: {
      email_templates: @email_templates.as_json(only: [:id, :name, :subject, :description, :active, :created_at, :updated_at])
    }
  end

  def show
    render inertia: 'Admin/EmailTemplates/Show', props: {
      email_template: @email_template.as_json
    }
  end

  def new
    @email_template = EmailTemplate.new

    render inertia: 'Admin/EmailTemplates/Form', props: {
      email_template: @email_template.as_json,
      available_variables: available_variables
    }
  end

  def create
    @email_template = EmailTemplate.new(email_template_params)

    if @email_template.save
      redirect_to admin_email_templates_path, notice: 'Email template created successfully.'
    else
      render inertia: 'Admin/EmailTemplates/Form', props: {
        email_template: @email_template.as_json,
        errors: @email_template.errors.full_messages,
        available_variables: available_variables
      }
    end
  end

  def edit
    render inertia: 'Admin/EmailTemplates/Form', props: {
      email_template: @email_template.as_json,
      available_variables: available_variables
    }
  end

  def update
    if @email_template.update(email_template_params)
      redirect_to admin_email_templates_path, notice: 'Email template updated successfully.'
    else
      render inertia: 'Admin/EmailTemplates/Form', props: {
        email_template: @email_template.as_json,
        errors: @email_template.errors.full_messages,
        available_variables: available_variables
      }
    end
  end

  def destroy
    @email_template.destroy
    redirect_to admin_email_templates_path, notice: 'Email template deleted successfully.'
  end

  def toggle_active
    @email_template.update(active: !@email_template.active)
    redirect_to admin_email_templates_path, notice: "Email template #{@email_template.active ? 'activated' : 'deactivated'}."
  end

  def preview
    template_name = params[:template_name]
    @email_template = EmailTemplate.find_by(name: template_name)

    if @email_template
      # Sample variables for preview
      preview_vars = sample_variables_for_template(template_name)
      rendered = @email_template.render(preview_vars)

      render json: {
        subject: rendered[:subject],
        body: rendered[:body],
        variables_used: preview_vars
      }
    else
      render json: { error: 'Template not found' }, status: :not_found
    end
  end

  private

  def set_email_template
    @email_template = EmailTemplate.find(params[:id])
  end

  def email_template_params
    params.require(:email_template).permit(:name, :subject, :body, :description, :active)
  end

  def available_variables
    {
      payment_confirmation: ['student_name', 'amount', 'quantity', 'purchase_type', 'transaction_id', 'date'],
      class_reminder: ['student_name', 'class_name', 'class_date', 'class_time', 'teacher_name'],
      enrollment_confirmation: ['student_name', 'batch_name', 'start_date', 'teacher_name', 'class_type'],
      payment_reminder: ['student_name', 'pending_amount', 'due_date'],
      credit_purchase: ['student_name', 'credits', 'batch_name', 'amount', 'expiry_date'],
      attendance_summary: ['student_name', 'period_start', 'period_end', 'total_classes', 'attended_classes', 'attendance_percentage']
    }
  end

  def sample_variables_for_template(template_name)
    case template_name
    when EmailTemplate::PAYMENT_CONFIRMATION
      { student_name: 'John Doe', amount: '₹5000', quantity: 10, purchase_type: 'One on one credit', transaction_id: 'TXN123456', date: Date.today.strftime('%d %b %Y') }
    when EmailTemplate::CLASS_REMINDER
      { student_name: 'John Doe', class_name: 'Carnatic Vocal - Beginners', class_date: Date.tomorrow.strftime('%d %b %Y'), class_time: '10:00 AM', teacher_name: 'Vibha Shree M S' }
    when EmailTemplate::ENROLLMENT_CONFIRMATION
      { student_name: 'John Doe', batch_name: 'Carnatic Vocal - Beginners', start_date: Date.today.strftime('%d %b %Y'), teacher_name: 'Vibha Shree M S', class_type: 'Group' }
    when EmailTemplate::PAYMENT_REMINDER
      { student_name: 'John Doe', pending_amount: '₹3000', due_date: 7.days.from_now.strftime('%d %b %Y') }
    when EmailTemplate::CREDIT_PURCHASE
      { student_name: 'John Doe', credits: 10, batch_name: 'Carnatic Vocal - Beginners', amount: '₹5000', expiry_date: 3.months.from_now.strftime('%d %b %Y') }
    when EmailTemplate::ATTENDANCE_SUMMARY
      { student_name: 'John Doe', period_start: 1.month.ago.strftime('%d %b %Y'), period_end: Date.today.strftime('%d %b %Y'), total_classes: 12, attended_classes: 10, attendance_percentage: 83.33 }
    else
      {}
    end
  end
end
