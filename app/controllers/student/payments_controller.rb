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

    # Get latest transaction for online payments
    latest_transaction = @payment.transactions.order(created_at: :desc).first
    
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
      status: @payment.status,
      fee_offer: @payment.fee_offer ? {
        id: @payment.fee_offer.id,
        name: @payment.fee_offer.name,
        discount_amount: @payment.fee_offer.discount_amount,
        discount_percentage: @payment.fee_offer.discount_percentage
      } : nil,
      recorded_by: @payment.recorded_by_user&.full_name,
      created_at: @payment.created_at,
      can_pay_online: @payment.status != 'completed',
      latest_transaction: latest_transaction ? {
        status: latest_transaction.status,
        payment_mode: latest_transaction.payment_mode,
        created_at: latest_transaction.created_at
      } : nil
    }

    render inertia: 'Student/Payments/Show', props: { payment: payment_data }
  end

  # POST /student/payments/:id/initiate_payment
  def initiate_payment
    authorize @payment
    
    # Only allow online payment for pending payments
    if @payment.status == 'completed'
      redirect_to student_payment_path(@payment), alert: 'Payment already completed!'
      return
    end
    
    # Create transaction record
    transaction_id = "TXN#{Time.now.to_i}#{@payment.id}"
    
    transaction = Transaction.create!(
      payment: @payment,
      student: current_user.student,
      phonepe_merchant_transaction_id: transaction_id,
      amount: @payment.amount,
      status: 'PENDING'
    )
    
    # Initialize PhonePe payment
    phonepe = PhonepeService.new
    result = phonepe.initiate_payment(
      amount: @payment.amount,
      transaction_id: transaction_id,
      user_id: current_user.id.to_s,
      mobile_number: current_user.phone || '9999999999',
      callback_url: phonepe_callback_url,
      redirect_url: phonepe_redirect_student_payment_url(@payment),
      description: "Payment for #{@payment.fee_structure&.name || 'Fees'}"
    )
    
    if result[:success]
      redirect_to result[:payment_url], allow_other_host: true
    else
      transaction.update!(status: 'FAILED', failure_reason: result[:error])
      redirect_to student_payment_path(@payment), alert: "Payment failed: #{result[:error]}"
    end
  end

  # GET /student/payments/:id/phonepe_callback
  def phonepe_callback
    authorize @payment
    
    # Check transaction status
    transaction = @payment.transactions.order(created_at: :desc).first
    
    if transaction
      phonepe = PhonepeService.new
      status = phonepe.check_status(transaction.phonepe_merchant_transaction_id)
      
      if status[:success]
        update_transaction_status(transaction, status)
        
        if status[:status] == 'COMPLETED'
          complete_payment(transaction)
          redirect_to student_payment_path(@payment), notice: 'Payment completed successfully!'
        elsif status[:status] == 'FAILED'
          redirect_to student_payment_path(@payment), alert: 'Payment failed. Please try again.'
        else
          redirect_to student_payment_path(@payment), notice: 'Payment is being processed...'
        end
      else
        redirect_to student_payment_path(@payment), alert: 'Unable to verify payment status.'
      end
    else
      redirect_to student_payment_path(@payment), alert: 'No transaction found.'
    end
  end

  # POST /student/payments/phonepe_webhook
  def phonepe_webhook
    # Handle PhonePe webhook callback
    payload = request.body.read
    checksum = request.headers['X-VERIFY']
    
    phonepe = PhonepeService.new
    
    if phonepe.verify_webhook(payload: payload, checksum_header: checksum)
      data = JSON.parse(Base64.decode64(JSON.parse(payload)['response']))
      
      transaction = Transaction.find_by(phonepe_merchant_transaction_id: data['merchantTransactionId'])
      
      if transaction
        update_transaction_status_from_webhook(transaction, data)
        
        if data['state'] == 'COMPLETED'
          complete_payment(transaction)
        end
      end
      
      head :ok
    else
      head :unauthorized
    end
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

  def update_transaction_status(transaction, status)
    transaction.update!(
      status: status[:status],
      payment_mode: status[:payment_mode],
      completed_at: status[:status] == 'COMPLETED' ? Time.now : nil
    )
  end

  def update_transaction_status_from_webhook(transaction, data)
    transaction.update!(
      phonepe_transaction_id: data['transactionId'],
      status: data['state'],
      payment_mode: data.dig('paymentInstrument', 'type'),
      phonepe_response: data,
      completed_at: data['state'] == 'COMPLETED' ? Time.now : nil
    )
  end

  def complete_payment(transaction)
    transaction.payment.update!(
      status: 'completed',
      payment_date: Time.now,
      payment_method: transaction.payment_mode || 'upi',
      transaction_reference: transaction.phonepe_transaction_id
    )
    
    # Send confirmation notification
    Rails.logger.info "Payment #{transaction.payment.id} completed via PhonePe"
  end

  def phonepe_callback_url
    "#{ENV['APP_URL']}/student/payments/phonepe_webhook"
  end
end
