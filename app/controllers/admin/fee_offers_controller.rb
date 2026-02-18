class Admin::FeeOffersController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_fee_offer, only: [:show, :edit, :update, :destroy]

  def index
    # Base query
    fee_offers = FeeOffer.order(created_at: :desc)

    # Search by name
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      fee_offers = fee_offers.where("name ILIKE ?", search_term)
    end

    # Filter by offer type
    if params[:offer_type].present?
      fee_offers = fee_offers.where(offer_type: params[:offer_type])
    end

    # Filter by status
    if params[:status].present?
      fee_offers = fee_offers.where(status: params[:status])
    end

    # Filter by applicable_to
    if params[:applicable_to].present?
      fee_offers = fee_offers.where(applicable_to: params[:applicable_to])
    end

    # Filter by current/upcoming
    if params[:time_filter] == 'current'
      fee_offers = fee_offers.current
    elsif params[:time_filter] == 'upcoming'
      fee_offers = fee_offers.upcoming
    end

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = fee_offers.count
    fee_offers = fee_offers.offset((page.to_i - 1) * per_page).limit(per_page)

    fee_offers_data = fee_offers.map do |fee_offer|
      {
        id: fee_offer.id,
        name: fee_offer.name,
        description: fee_offer.description,
        offer_type: fee_offer.offer_type,
        duration_months: fee_offer.duration_months,
        discount_percentage: fee_offer.discount_percentage,
        discount_amount: fee_offer.discount_amount,
        special_price: fee_offer.special_price,
        applicable_to: fee_offer.applicable_to,
        valid_from: fee_offer.valid_from,
        valid_to: fee_offer.valid_to,
        status: fee_offer.status,
        current: fee_offer.current?,
        expired: fee_offer.expired?
      }
    end

    render inertia: 'Admin/FeeOffers/Index', props: {
      fee_offers: fee_offers_data,
      filters: {
        search: params[:search],
        offer_type: params[:offer_type],
        status: params[:status],
        applicable_to: params[:applicable_to],
        time_filter: params[:time_filter]
      },
      pagination: {
        current_page: page.to_i,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      offer_types: FeeOffer.offer_types.keys,
      statuses: FeeOffer.statuses.keys,
      applicable_to_options: FeeOffer.applicable_tos.keys
    }
  end

  def show
    fee_offer_data = {
      id: @fee_offer.id,
      name: @fee_offer.name,
      description: @fee_offer.description,
      offer_type: @fee_offer.offer_type,
      duration_months: @fee_offer.duration_months,
      discount_percentage: @fee_offer.discount_percentage,
      discount_amount: @fee_offer.discount_amount,
      special_price: @fee_offer.special_price,
      applicable_to: @fee_offer.applicable_to,
      valid_from: @fee_offer.valid_from,
      valid_to: @fee_offer.valid_to,
      status: @fee_offer.status,
      current: @fee_offer.current?,
      expired: @fee_offer.expired?,
      created_at: @fee_offer.created_at
    }

    render inertia: 'Admin/FeeOffers/Show', props: { fee_offer: fee_offer_data }
  end

  def new
    render inertia: 'Admin/FeeOffers/New', props: {
      offer_types: FeeOffer.offer_types.keys,
      statuses: FeeOffer.statuses.keys,
      applicable_to_options: FeeOffer.applicable_tos.keys,
      duration_options: [
        { value: 3, label: '3 Months' },
        { value: 6, label: '6 Months' },
        { value: 12, label: '12 Months' }
      ],
      fee_offer: {
        name: '',
        description: '',
        offer_type: 'percentage_discount',
        duration_months: 3,
        discount_percentage: nil,
        discount_amount: nil,
        special_price: nil,
        applicable_to: 'all_students',
        valid_from: Date.today.to_s,
        valid_to: (Date.today + 30.days).to_s,
        status: 'active'
      }
    }
  end

  def create
    @fee_offer = FeeOffer.new(fee_offer_params)

    if @fee_offer.save
      redirect_to admin_fee_offers_path, notice: 'Fee offer was successfully created.'
    else
      render inertia: 'Admin/FeeOffers/New', props: {
        fee_offer: fee_offer_params,
        errors: @fee_offer.errors.full_messages,
        offer_types: FeeOffer.offer_types.keys,
        statuses: FeeOffer.statuses.keys,
        applicable_to_options: FeeOffer.applicable_tos.keys,
        duration_options: [
          { value: 3, label: '3 Months' },
          { value: 6, label: '6 Months' },
          { value: 12, label: '12 Months' }
        ]
      }
    end
  end

  def edit
    render inertia: 'Admin/FeeOffers/Edit', props: {
      fee_offer: {
        id: @fee_offer.id,
        name: @fee_offer.name,
        description: @fee_offer.description,
        offer_type: @fee_offer.offer_type,
        duration_months: @fee_offer.duration_months,
        discount_percentage: @fee_offer.discount_percentage,
        discount_amount: @fee_offer.discount_amount,
        special_price: @fee_offer.special_price,
        applicable_to: @fee_offer.applicable_to,
        valid_from: @fee_offer.valid_from,
        valid_to: @fee_offer.valid_to,
        status: @fee_offer.status
      },
      offer_types: FeeOffer.offer_types.keys,
      statuses: FeeOffer.statuses.keys,
      applicable_to_options: FeeOffer.applicable_tos.keys,
      duration_options: [
        { value: 3, label: '3 Months' },
        { value: 6, label: '6 Months' },
        { value: 12, label: '12 Months' }
      ]
    }
  end

  def update
    if @fee_offer.update(fee_offer_params)
      redirect_to admin_fee_offers_path, notice: 'Fee offer was successfully updated.'
    else
      render inertia: 'Admin/FeeOffers/Edit', props: {
        fee_offer: fee_offer_params.merge(id: @fee_offer.id),
        errors: @fee_offer.errors.full_messages,
        offer_types: FeeOffer.offer_types.keys,
        statuses: FeeOffer.statuses.keys,
        applicable_to_options: FeeOffer.applicable_tos.keys,
        duration_options: [
          { value: 3, label: '3 Months' },
          { value: 6, label: '6 Months' },
          { value: 12, label: '12 Months' }
        ]
      }
    end
  end

  def destroy
    if @fee_offer.destroy
      redirect_to admin_fee_offers_path, notice: 'Fee offer was successfully deleted.'
    else
      redirect_to admin_fee_offers_path, alert: 'Failed to delete fee offer.'
    end
  end

  private

  def set_fee_offer
    @fee_offer = FeeOffer.find(params[:id])
  end

  def authenticate_admin!
    unless current_user&.admin?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def fee_offer_params
    params.require(:fee_offer).permit(
      :name,
      :description,
      :offer_type,
      :duration_months,
      :discount_percentage,
      :discount_amount,
      :special_price,
      :applicable_to,
      :valid_from,
      :valid_to,
      :status
    )
  end
end
