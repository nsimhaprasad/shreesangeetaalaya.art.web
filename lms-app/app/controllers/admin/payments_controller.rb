class Admin::PaymentsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_payment, only: [:show, :edit, :update, :destroy]

  def index
    # Base query - all payments
    payments = Payment
      .includes(:student, :batch_enrollment, :fee_offer, :recorded_by_user, batch_enrollment: [:batch])
      .order(payment_date: :desc)

    # Search by student name or transaction reference
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      payments = payments.joins(student: :user).where(
        "users.first_name ILIKE ? OR users.last_name ILIKE ? OR payments.transaction_reference ILIKE ?",
        search_term, search_term, search_term
      )
    end

    # Filter by payment method
    if params[:payment_method].present?
      payments = payments.where(payment_method: params[:payment_method])
    end

    # Filter by date range
    if params[:from_date].present?
      payments = payments.where("payment_date >= ?", params[:from_date])
    end

    if params[:to_date].present?
      payments = payments.where("payment_date <= ?", params[:to_date])
    end

    # Filter by batch
    if params[:batch_id].present?
      payments = payments.joins(:batch_enrollment).where(batch_enrollments: { batch_id: params[:batch_id] })
    end

    # Filter by student
    if params[:student_id].present?
      payments = payments.where(student_id: params[:student_id])
    end

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = payments.count
    payments = payments.offset((page.to_i - 1) * per_page).limit(per_page)

    # Calculate summary stats
    total_received = Payment.sum(:amount)
    monthly_received = Payment.for_month(Date.today).sum(:amount)

    payments_data = payments.map do |payment|
      {
        id: payment.id,
        student_name: payment.student.user&.full_name,
        student_id: payment.student.id,
        batch_name: payment.batch_enrollment.batch.name,
        batch_id: payment.batch_enrollment.batch.id,
        amount: payment.amount,
        display_amount: payment.display_amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        transaction_reference: payment.transaction_reference,
        months_covered: payment.months_covered,
        classes_covered: payment.classes_covered,
        fee_offer: payment.fee_offer&.name,
        has_offer: payment.has_offer?,
        notes: payment.notes,
        recorded_by: payment.recorded_by_user&.full_name
      }
    end

    # Get all active batches for filter dropdown
    batches = Batch.active.order(:name).map { |b| { id: b.id, name: b.name } }

    # Get all students for filter dropdown
    students = Student.joins(:user).order('users.first_name', 'users.last_name').limit(100).map do |s|
      { id: s.id, name: s.user&.full_name }
    end

    render inertia: 'Admin/Payments/Index', props: {
      payments: payments_data,
      batches: batches,
      students: students,
      filters: {
        search: params[:search],
        payment_method: params[:payment_method],
        from_date: params[:from_date],
        to_date: params[:to_date],
        batch_id: params[:batch_id],
        student_id: params[:student_id]
      },
      summary: {
        total_received: total_received,
        monthly_received: monthly_received,
        count: total_count
      },
      pagination: {
        current_page: page.to_i,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      payment_methods: Payment.payment_methods.keys
    }
  end

  def show
    payment_data = {
      id: @payment.id,
      student: {
        id: @payment.student.id,
        name: @payment.student.user&.full_name,
        email: @payment.student.user&.email,
        phone: @payment.student.user&.phone
      },
      batch_enrollment: {
        id: @payment.batch_enrollment.id,
        batch_name: @payment.batch_enrollment.batch.name,
        course_name: @payment.batch_enrollment.batch.course.name
      },
      amount: @payment.amount,
      display_amount: @payment.display_amount,
      payment_date: @payment.payment_date,
      payment_method: @payment.payment_method,
      transaction_reference: @payment.transaction_reference,
      months_covered: @payment.months_covered,
      classes_covered: @payment.classes_covered,
      notes: @payment.notes,
      fee_offer: @payment.fee_offer ? {
        id: @payment.fee_offer.id,
        name: @payment.fee_offer.name,
        discount_amount: @payment.fee_offer.discount_amount,
        discount_percentage: @payment.fee_offer.discount_percentage
      } : nil,
      recorded_by: @payment.recorded_by_user&.full_name,
      created_at: @payment.created_at,
      updated_at: @payment.updated_at
    }

    render inertia: 'Admin/Payments/Show', props: { payment: payment_data }
  end

  def new
    # Get all students
    students = Student.joins(:user).order('users.first_name', 'users.last_name').map do |s|
      { id: s.id, name: s.user&.full_name }
    end

    # Get active fee offers
    fee_offers = FeeOffer.current.map do |offer|
      {
        id: offer.id,
        name: offer.name,
        offer_type: offer.offer_type,
        discount_percentage: offer.discount_percentage,
        discount_amount: offer.discount_amount
      }
    end

    render inertia: 'Admin/Payments/New', props: {
      students: students,
      fee_offers: fee_offers,
      payment_methods: Payment.payment_methods.keys,
      payment: {
        student_id: nil,
        batch_enrollment_id: nil,
        amount: 0,
        payment_date: Date.today.to_s,
        payment_method: 'cash',
        fee_offer_id: nil,
        transaction_reference: '',
        months_covered: nil,
        classes_covered: nil,
        notes: ''
      }
    }
  end

  def create
    @payment = Payment.new(payment_params)
    @payment.recorded_by = current_user.id

    if @payment.save
      redirect_to admin_payments_path, notice: 'Payment was successfully recorded.'
    else
      # Reload data for form
      students = Student.joins(:user).order('users.first_name', 'users.last_name').map do |s|
        { id: s.id, name: s.user&.full_name }
      end

      fee_offers = FeeOffer.current.map do |offer|
        {
          id: offer.id,
          name: offer.name,
          offer_type: offer.offer_type,
          discount_percentage: offer.discount_percentage,
          discount_amount: offer.discount_amount
        }
      end

      render inertia: 'Admin/Payments/New', props: {
        payment: payment_params,
        students: students,
        fee_offers: fee_offers,
        payment_methods: Payment.payment_methods.keys,
        errors: @payment.errors.full_messages
      }
    end
  end

  def edit
    students = Student.joins(:user).order('users.first_name', 'users.last_name').map do |s|
      { id: s.id, name: s.user&.full_name }
    end

    fee_offers = FeeOffer.current.map do |offer|
      {
        id: offer.id,
        name: offer.name,
        offer_type: offer.offer_type,
        discount_percentage: offer.discount_percentage,
        discount_amount: offer.discount_amount
      }
    end

    # Get enrollments for selected student
    enrollments = @payment.student.batch_enrollments.active.includes(batch: :course).map do |enrollment|
      {
        id: enrollment.id,
        batch_name: enrollment.batch.name,
        course_name: enrollment.batch.course.name,
        fee_amount: enrollment.batch.current_fee
      }
    end

    render inertia: 'Admin/Payments/Edit', props: {
      students: students,
      fee_offers: fee_offers,
      enrollments: enrollments,
      payment_methods: Payment.payment_methods.keys,
      payment: {
        id: @payment.id,
        student_id: @payment.student_id,
        batch_enrollment_id: @payment.batch_enrollment_id,
        amount: @payment.amount,
        payment_date: @payment.payment_date,
        payment_method: @payment.payment_method,
        fee_offer_id: @payment.fee_offer_id,
        transaction_reference: @payment.transaction_reference,
        months_covered: @payment.months_covered,
        classes_covered: @payment.classes_covered,
        notes: @payment.notes
      }
    }
  end

  def update
    if @payment.update(payment_params)
      redirect_to admin_payments_path, notice: 'Payment was successfully updated.'
    else
      students = Student.joins(:user).order('users.first_name', 'users.last_name').map do |s|
        { id: s.id, name: s.user&.full_name }
      end

      fee_offers = FeeOffer.current.map do |offer|
        {
          id: offer.id,
          name: offer.name,
          offer_type: offer.offer_type,
          discount_percentage: offer.discount_percentage,
          discount_amount: offer.discount_amount
        }
      end

      enrollments = @payment.student.batch_enrollments.active.includes(batch: :course).map do |enrollment|
        {
          id: enrollment.id,
          batch_name: enrollment.batch.name,
          course_name: enrollment.batch.course.name,
          fee_amount: enrollment.batch.current_fee
        }
      end

      render inertia: 'Admin/Payments/Edit', props: {
        payment: payment_params.merge(id: @payment.id),
        students: students,
        fee_offers: fee_offers,
        enrollments: enrollments,
        payment_methods: Payment.payment_methods.keys,
        errors: @payment.errors.full_messages
      }
    end
  end

  def destroy
    if @payment.destroy
      redirect_to admin_payments_path, notice: 'Payment was successfully deleted.'
    else
      redirect_to admin_payments_path, alert: 'Failed to delete payment.'
    end
  end

  private

  def set_payment
    @payment = Payment.find(params[:id])
  end

  def authenticate_admin!
    unless current_user&.admin?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def payment_params
    params.require(:payment).permit(
      :student_id,
      :batch_enrollment_id,
      :amount,
      :payment_date,
      :payment_method,
      :fee_offer_id,
      :transaction_reference,
      :months_covered,
      :classes_covered,
      :notes
    )
  end
end
