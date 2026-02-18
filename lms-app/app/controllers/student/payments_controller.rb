class Student::PaymentsController < ApplicationController
  before_action :authenticate_student!
  before_action :set_payment, only: [:show]

  def index
    authorize Payment
    student = current_user.student

    # Base query - only this student's payments
    payments = student.payments
      .includes(:batch_enrollment, :fee_offer, batch_enrollment: [:batch])
      .order(payment_date: :desc)

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
    total_paid = student.payments.sum(:amount)

    # Calculate outstanding balance
    # This is a simplified calculation - in real app, would be based on fee structures
    active_enrollments = student.batch_enrollments.active
    total_due = active_enrollments.sum do |enrollment|
      enrollment.batch.current_fee || 0
    end
    outstanding_balance = total_due - total_paid

    payments_data = payments.map do |payment|
      {
        id: payment.id,
        batch_name: payment.batch_enrollment.batch.name,
        course_name: payment.batch_enrollment.batch.course.name,
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

    # Get student's active batches for filter dropdown
    batches = student.batches.where(batch_enrollments: { status: 'active' })
      .distinct
      .map { |b| { id: b.id, name: b.name } }

    render inertia: 'Student/Payments/Index', props: {
      payments: payments_data,
      batches: batches,
      filters: {
        payment_method: params[:payment_method],
        from_date: params[:from_date],
        to_date: params[:to_date],
        batch_id: params[:batch_id]
      },
      summary: {
        total_paid: total_paid,
        outstanding_balance: outstanding_balance,
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
      receipt_number: "REC-#{@payment.id.to_s.rjust(6, '0')}",
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
        id: @payment.fee_offer.id,
        name: @payment.fee_offer.name,
        discount_amount: @payment.fee_offer.discount_amount,
        discount_percentage: @payment.fee_offer.discount_percentage
      } : nil,
      recorded_by: @payment.recorded_by_user&.full_name,
      created_at: @payment.created_at
    }

    render inertia: 'Student/Payments/Show', props: { payment: payment_data }
  end

  private

  def set_payment
    student = current_user.student
    @payment = student.payments.find(params[:id])
  end

  def authenticate_student!
    unless current_user&.student?
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
