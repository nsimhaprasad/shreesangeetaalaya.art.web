class Teacher::FeeStructuresController < ApplicationController
  before_action :authenticate_teacher!

  def index
    teacher = current_user.teacher

    # Get batches for this teacher
    batches = teacher.batches.includes(:course, :fee_structures).order(:name)

    # Build data for each batch with fee information
    batches_data = batches.map do |batch|
      current_fee = batch.fee_structures.current.first
      all_fees = batch.fee_structures.order(effective_from: :desc)

      {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name,
        class_type: batch.class_type,
        status: batch.status,
        current_fee: current_fee ? {
          id: current_fee.id,
          amount: current_fee.amount,
          class_type: current_fee.class_type,
          fee_type: current_fee.fee_type,
          effective_from: current_fee.effective_from,
          effective_to: current_fee.effective_to
        } : nil,
        fee_history: all_fees.map do |fee|
          {
            id: fee.id,
            amount: fee.amount,
            class_type: fee.class_type,
            fee_type: fee.fee_type,
            effective_from: fee.effective_from,
            effective_to: fee.effective_to,
            current: fee.current?,
            active: fee.active?
          }
        end,
        enrollment_count: batch.enrollment_count,
        max_students: batch.max_students
      }
    end

    # Get current fee offers
    current_offers = FeeOffer.current.order(:name)
    offers_data = current_offers.map do |offer|
      {
        id: offer.id,
        name: offer.name,
        description: offer.description,
        offer_type: offer.offer_type,
        duration_months: offer.duration_months,
        discount_percentage: offer.discount_percentage,
        discount_amount: offer.discount_amount,
        special_price: offer.special_price,
        applicable_to: offer.applicable_to,
        valid_from: offer.valid_from,
        valid_to: offer.valid_to
      }
    end

    render inertia: 'Teacher/Fees/Index', props: {
      batches: batches_data,
      current_offers: offers_data,
      class_types: Batch.class_types.keys,
      fee_types: FeeStructure.fee_types.keys
    }
  end

  private

  def authenticate_teacher!
    unless current_user&.teacher?
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
