class Student::PurchasesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_student
  before_action :set_purchase, only: [:show, :cancel]

  def index
    @purchases = @student.student_purchases.recent

    render inertia: 'Student/Purchases/Index', props: {
      purchases: @purchases.as_json(include: { batch: { only: [:id, :name] } }),
      student: @student.as_json(
        only: [:id],
        methods: [:name, :remaining_credits]
      )
    }
  end

  def new
    # Get student's batches to show purchase options
    @batches = @student.active_batches.includes(:fee_structures, :course)
    @available_offers = FeeOffer.active.applicable_for_student(@student)

    render inertia: 'Student/Purchases/New', props: {
      student: @student.as_json(
        only: [:id],
        methods: [:name, :remaining_credits]
      ),
      batches: @batches.as_json(
        include: {
          course: { only: [:id, :name] },
          fee_structures: { only: [:id, :class_type, :fee_type, :amount, :effective_from, :effective_to] }
        },
        methods: [:current_fee]
      ),
      offers: @available_offers.as_json,
      purchase_options: generate_purchase_options
    }
  end

  def create
    @purchase = @student.student_purchases.build(purchase_params)

    if @purchase.save
      # If payment method is 'cash' or 'upi', mark as completed immediately
      # In future, integrate with payment gateway for card payments
      if ['cash', 'upi', 'bank_transfer'].include?(params[:student_purchase][:payment_method])
        @purchase.mark_as_completed!(
          payment_method: params[:student_purchase][:payment_method],
          transaction_id: params[:student_purchase][:transaction_id]
        )
        redirect_to student_purchases_path, notice: 'Purchase completed successfully! Your credits have been added.'
      else
        # Redirect to payment gateway (to be implemented)
        redirect_to student_purchase_path(@purchase), notice: 'Purchase created. Please complete payment.'
      end
    else
      render inertia: 'Student/Purchases/New', props: {
        student: @student.as_json(only: [:id], methods: [:name]),
        purchase: @purchase.as_json,
        errors: @purchase.errors.full_messages,
        purchase_options: generate_purchase_options
      }
    end
  end

  def show
    render inertia: 'Student/Purchases/Show', props: {
      purchase: @purchase.as_json(
        include: {
          batch: { only: [:id, :name] },
          student: { only: [:id], methods: [:name] }
        }
      ),
      student: @student.as_json(only: [:id], methods: [:name])
    }
  end

  def cancel
    if @purchase.status_pending?
      @purchase.update(payment_status: 'cancelled')
      redirect_to student_purchases_path, notice: 'Purchase cancelled successfully.'
    else
      redirect_to student_purchases_path, alert: 'Cannot cancel this purchase.'
    end
  end

  # Show available packages and pricing
  def packages
    @batches = @student.active_batches.includes(:fee_structures)

    packages = []
    @batches.each do |batch|
      current_fee = batch.current_fee
      next unless current_fee

      # Generate package options based on class type
      if batch.class_one_on_one?
        packages << {
          batch_id: batch.id,
          batch_name: batch.name,
          class_type: 'one_on_one',
          options: generate_credit_options(current_fee)
        }
      else
        packages << {
          batch_id: batch.id,
          batch_name: batch.name,
          class_type: 'group',
          options: generate_group_class_options(current_fee)
        }
      end
    end

    render inertia: 'Student/Purchases/Packages', props: {
      packages: packages,
      student: @student.as_json(
        only: [:id],
        methods: [:name, :remaining_credits]
      ),
      available_offers: FeeOffer.active.as_json
    }
  end

  # Show student's credit balance
  def credits
    @class_credits = @student.class_credits.active.includes(:batch)

    render inertia: 'Student/Purchases/Credits', props: {
      credits: @class_credits.as_json(
        include: { batch: { only: [:id, :name] } },
        methods: [:remaining_credits, :per_class_rate]
      ),
      total_credits: @student.total_credits,
      used_credits: @student.total_used_credits,
      remaining_credits: @student.remaining_credits
    }
  end

  private

  def set_student
    @student = current_user.student
    redirect_to root_path, alert: 'Student account required' unless @student
  end

  def set_purchase
    @purchase = @student.student_purchases.find(params[:id])
  end

  def purchase_params
    params.require(:student_purchase).permit(
      :batch_id,
      :purchase_type,
      :quantity,
      :amount,
      :payment_method,
      :transaction_id,
      :notes
    )
  end

  def generate_purchase_options
    {
      credit_packages: [
        { quantity: 4, label: '4 Classes', discount: 0 },
        { quantity: 8, label: '8 Classes', discount: 5 },
        { quantity: 12, label: '12 Classes', discount: 10 },
        { quantity: 24, label: '24 Classes', discount: 15 }
      ],
      duration_packages: [
        { duration: 3, label: '3 Months', type: 'package_3_months', discount: 10 },
        { duration: 6, label: '6 Months', type: 'package_6_months', discount: 15 },
        { duration: 12, label: '12 Months', type: 'package_12_months', discount: 20 }
      ],
      payment_methods: [
        { value: 'cash', label: 'Cash' },
        { value: 'upi', label: 'UPI' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'card', label: 'Credit/Debit Card (Coming Soon)', disabled: true }
      ]
    }
  end

  def generate_credit_options(fee_structure)
    base_rate = fee_structure.fee_type == 'per_class' ? fee_structure.amount : fee_structure.amount / 4

    [
      { credits: 4, amount: base_rate * 4, discount: 0 },
      { credits: 8, amount: (base_rate * 8 * 0.95).round(2), discount: 5 },
      { credits: 12, amount: (base_rate * 12 * 0.90).round(2), discount: 10 },
      { credits: 24, amount: (base_rate * 24 * 0.85).round(2), discount: 15 }
    ]
  end

  def generate_group_class_options(fee_structure)
    monthly_rate = fee_structure.fee_type == 'monthly' ? fee_structure.amount : fee_structure.amount * 4

    [
      { duration: 1, amount: monthly_rate, label: '1 Month' },
      { duration: 3, amount: (monthly_rate * 3 * 0.90).round(2), label: '3 Months', discount: 10 },
      { duration: 6, amount: (monthly_rate * 6 * 0.85).round(2), label: '6 Months', discount: 15 },
      { duration: 12, amount: (monthly_rate * 12 * 0.80).round(2), label: '12 Months', discount: 20 }
    ]
  end
end
