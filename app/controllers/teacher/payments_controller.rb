class Teacher::PaymentsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_payment, only: [:show, :edit, :update, :destroy, :receipt]

  def index
    authorize Payment
    teacher = current_user.teacher

    # Base query - payments for students in teacher's batches
    payments = policy_scope(Payment)
      .includes(:student, :batch_enrollment, :fee_offer, batch_enrollment: [:batch])
      .order(payment_date: :desc)

    # Search by student name
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      payments = payments.joins(student: :user).where(
        "users.first_name ILIKE ? OR users.last_name ILIKE ?",
        search_term, search_term
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

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = payments.count
    payments = payments.offset((page.to_i - 1) * per_page).limit(per_page)

    # Calculate summary stats
    total_received = payments.sum(:amount)

    payments_data = payments.map do |payment|
      {
        id: payment.id,
        student_name: payment.student.user&.full_name,
        batch_name: payment.batch_enrollment.batch.name,
        amount: payment.amount,
        display_amount: payment.display_amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        transaction_reference: payment.transaction_reference,
        months_covered: payment.months_covered,
        classes_covered: payment.classes_covered,
        fee_offer: payment.fee_offer&.name,
        has_offer: payment.has_offer?,
        notes: payment.notes
      }
    end

    # Get teacher's batches for filter dropdown
    batches = teacher.batches.active.map { |b| { id: b.id, name: b.name } }

    render inertia: 'Teacher/Payments/Index', props: {
      payments: payments_data,
      batches: batches,
      filters: {
        search: params[:search],
        payment_method: params[:payment_method],
        from_date: params[:from_date],
        to_date: params[:to_date],
        batch_id: params[:batch_id]
      },
      summary: {
        total_received: total_received,
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
    authorize @payment

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

    render inertia: 'Teacher/Payments/Show', props: { payment: payment_data }
  end

  def new
    authorize Payment
    teacher = current_user.teacher

    # Get students in teacher's batches
    students = policy_scope(Student)
      .joins(:batch_enrollments)
      .where(batch_enrollments: { batch_id: teacher.batches.active.pluck(:id), status: 'active' })
      .distinct
      .includes(:user)
      .map { |s| { id: s.id, name: s.user&.full_name } }

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

    render inertia: 'Teacher/Payments/New', props: {
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
    authorize Payment

    payment = Payment.new(payment_params)
    payment.recorded_by = current_user.id

    if payment.save
      redirect_to teacher_payment_path(payment), notice: 'Payment was successfully recorded.'
    else
      # Reload data for form
      teacher = current_user.teacher
      students = policy_scope(Student)
        .joins(:batch_enrollments)
        .where(batch_enrollments: { batch_id: teacher.batches.active.pluck(:id), status: 'active' })
        .distinct
        .includes(:user)
        .map { |s| { id: s.id, name: s.user&.full_name } }

      fee_offers = FeeOffer.current.map do |offer|
        {
          id: offer.id,
          name: offer.name,
          offer_type: offer.offer_type,
          discount_percentage: offer.discount_percentage,
          discount_amount: offer.discount_amount
        }
      end

      render inertia: 'Teacher/Payments/New', props: {
        payment: payment,
        students: students,
        fee_offers: fee_offers,
        payment_methods: Payment.payment_methods.keys,
        errors: payment.errors.full_messages
      }
    end
  end

  def edit
    authorize @payment
    teacher = current_user.teacher

    students = policy_scope(Student)
      .joins(:batch_enrollments)
      .where(batch_enrollments: { batch_id: teacher.batches.active.pluck(:id), status: 'active' })
      .distinct
      .includes(:user)
      .map { |s| { id: s.id, name: s.user&.full_name } }

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

    render inertia: 'Teacher/Payments/Edit', props: {
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
    authorize @payment

    if @payment.update(payment_params)
      redirect_to teacher_payment_path(@payment), notice: 'Payment was successfully updated.'
    else
      teacher = current_user.teacher
      students = policy_scope(Student)
        .joins(:batch_enrollments)
        .where(batch_enrollments: { batch_id: teacher.batches.active.pluck(:id), status: 'active' })
        .distinct
        .includes(:user)
        .map { |s| { id: s.id, name: s.user&.full_name } }

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

      render inertia: 'Teacher/Payments/Edit', props: {
        payment: @payment,
        students: students,
        fee_offers: fee_offers,
        enrollments: enrollments,
        payment_methods: Payment.payment_methods.keys,
        errors: @payment.errors.full_messages
      }
    end
  end

  def destroy
    authorize @payment

    if @payment.destroy
      redirect_to teacher_payments_path, notice: 'Payment was successfully deleted.'
    else
      redirect_to teacher_payment_path(@payment), alert: 'Failed to delete payment.'
    end
  end

  def receipt
    authorize @payment

    payment_data = {
      id: @payment.id,
      receipt_number: "REC-#{@payment.id.to_s.rjust(6, '0')}",
      student: {
        id: @payment.student.id,
        name: @payment.student.user&.full_name,
        email: @payment.student.user&.email,
        phone: @payment.student.user&.phone,
        enrollment_date: @payment.student.enrollment_date
      },
      batch_enrollment: {
        id: @payment.batch_enrollment.id,
        batch_name: @payment.batch_enrollment.batch.name,
        course_name: @payment.batch_enrollment.batch.course.name,
        class_type: @payment.batch_enrollment.batch.class_type
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
        name: @payment.fee_offer.name,
        discount_amount: @payment.fee_offer.discount_amount,
        discount_percentage: @payment.fee_offer.discount_percentage
      } : nil,
      recorded_by: @payment.recorded_by_user&.full_name,
      created_at: @payment.created_at
    }

    render inertia: 'Teacher/Payments/Receipt', props: { payment: payment_data }
  end

  # API endpoint to get enrollments for a student
  def student_enrollments
    authorize Payment
    student = Student.find(params[:student_id])

    enrollments = student.batch_enrollments.active.includes(batch: [:course, :fee_structures]).map do |enrollment|
      fee_structure = enrollment.batch.fee_structures.current.first
      {
        id: enrollment.id,
        batch_name: enrollment.batch.name,
        course_name: enrollment.batch.course.name,
        fee_amount: fee_structure&.amount,
        fee_type: fee_structure&.fee_type
      }
    end

    render json: { enrollments: enrollments }
  end

  # API endpoint to calculate payment amount
  def calculate_amount
    authorize Payment

    enrollment = BatchEnrollment.find(params[:batch_enrollment_id])
    fee_structure = enrollment.batch.fee_structures.current.first

    base_amount = fee_structure&.amount || 0

    # Apply fee offer if provided
    if params[:fee_offer_id].present?
      fee_offer = FeeOffer.find(params[:fee_offer_id])
      discount = fee_offer.calculate_discount(base_amount)
      final_amount = base_amount - discount
    else
      discount = 0
      final_amount = base_amount
    end

    # Adjust for months/classes covered
    if fee_structure&.fee_type == 'monthly' && params[:months_covered].present?
      final_amount = final_amount * params[:months_covered].to_i
    elsif fee_structure&.fee_type == 'per_class' && params[:classes_covered].present?
      final_amount = final_amount * params[:classes_covered].to_i
    end

    render json: {
      base_amount: base_amount,
      discount: discount,
      final_amount: final_amount,
      fee_type: fee_structure&.fee_type
    }
  end

  private

  def set_payment
    @payment = policy_scope(Payment).find(params[:id])
  end

  def authenticate_teacher!
    unless current_user&.teacher?
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
