class Admin::FeeStructuresController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_fee_structure, only: [:show, :edit, :update, :destroy]

  def index
    # Base query
    fee_structures = FeeStructure
      .includes(:batch)
      .order(created_at: :desc)

    # Search by batch name
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      fee_structures = fee_structures.joins(:batch).where(
        "batches.name ILIKE ?",
        search_term
      )
    end

    # Filter by class type
    if params[:class_type].present?
      fee_structures = fee_structures.where(class_type: params[:class_type])
    end

    # Filter by fee type
    if params[:fee_type].present?
      fee_structures = fee_structures.where(fee_type: params[:fee_type])
    end

    # Filter by active/current status
    if params[:status] == 'current'
      fee_structures = fee_structures.current
    elsif params[:status] == 'active'
      fee_structures = fee_structures.active
    end

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = fee_structures.count
    fee_structures = fee_structures.offset((page.to_i - 1) * per_page).limit(per_page)

    fee_structures_data = fee_structures.map do |fee_structure|
      {
        id: fee_structure.id,
        batch_id: fee_structure.batch_id,
        batch_name: fee_structure.batch.name,
        course_name: fee_structure.batch.course.name,
        class_type: fee_structure.class_type,
        fee_type: fee_structure.fee_type,
        amount: fee_structure.amount,
        effective_from: fee_structure.effective_from,
        effective_to: fee_structure.effective_to,
        current: fee_structure.current?,
        active: fee_structure.active?
      }
    end

    render inertia: 'Admin/FeeStructures/Index', props: {
      fee_structures: fee_structures_data,
      filters: {
        search: params[:search],
        class_type: params[:class_type],
        fee_type: params[:fee_type],
        status: params[:status]
      },
      pagination: {
        current_page: page.to_i,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      class_types: FeeStructure.class_types.keys,
      fee_types: FeeStructure.fee_types.keys
    }
  end

  def history
    # Get fee structures grouped by batch
    batch_id = params[:batch_id]

    if batch_id.present?
      batch = Batch.find(batch_id)
      fee_structures = batch.fee_structures.order(effective_from: :desc)

      fee_structures_data = fee_structures.map do |fee_structure|
        {
          id: fee_structure.id,
          class_type: fee_structure.class_type,
          fee_type: fee_structure.fee_type,
          amount: fee_structure.amount,
          effective_from: fee_structure.effective_from,
          effective_to: fee_structure.effective_to,
          current: fee_structure.current?,
          active: fee_structure.active?
        }
      end

      batch_data = {
        id: batch.id,
        name: batch.name,
        course_name: batch.course.name
      }
    else
      # Get all batches with their current fees
      batches = Batch.includes(:course, :fee_structures).order(:name)

      batches_data = batches.map do |batch|
        current_fee = batch.fee_structures.current.first
        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name,
          current_fee: current_fee ? {
            amount: current_fee.amount,
            class_type: current_fee.class_type,
            fee_type: current_fee.fee_type,
            effective_from: current_fee.effective_from
          } : nil,
          fee_count: batch.fee_structures.count
        }
      end

      render inertia: 'Admin/FeeStructures/History', props: {
        batches: batches_data,
        fee_structures: [],
        batch: nil
      }
      return
    end

    render inertia: 'Admin/FeeStructures/History', props: {
      batches: [],
      fee_structures: fee_structures_data,
      batch: batch_data
    }
  end

  def show
    fee_structure_data = {
      id: @fee_structure.id,
      batch_id: @fee_structure.batch_id,
      batch_name: @fee_structure.batch.name,
      course_name: @fee_structure.batch.course.name,
      class_type: @fee_structure.class_type,
      fee_type: @fee_structure.fee_type,
      amount: @fee_structure.amount,
      effective_from: @fee_structure.effective_from,
      effective_to: @fee_structure.effective_to,
      current: @fee_structure.current?,
      active: @fee_structure.active?,
      created_at: @fee_structure.created_at
    }

    render inertia: 'Admin/FeeStructures/Show', props: { fee_structure: fee_structure_data }
  end

  def new
    batches = Batch.active.includes(:course).order(:name)
    batches_data = batches.map do |batch|
      {
        value: batch.id,
        label: "#{batch.name} (#{batch.course.name})"
      }
    end

    render inertia: 'Admin/FeeStructures/New', props: {
      batches: batches_data,
      class_types: FeeStructure.class_types.keys,
      fee_types: FeeStructure.fee_types.keys,
      fee_structure: {
        batch_id: nil,
        class_type: 'group',
        fee_type: 'monthly',
        amount: '',
        effective_from: Date.today.to_s,
        effective_to: nil
      }
    }
  end

  def create
    @fee_structure = FeeStructure.new(fee_structure_params)

    # Validate no overlap with existing fee structures
    if overlapping_fee_structure?(@fee_structure)
      render inertia: 'Admin/FeeStructures/New', props: {
        fee_structure: fee_structure_params,
        errors: ['A fee structure with overlapping dates already exists for this batch and class type'],
        batches: get_batches_data,
        class_types: FeeStructure.class_types.keys,
        fee_types: FeeStructure.fee_types.keys
      }
      return
    end

    if @fee_structure.save
      redirect_to admin_fee_structures_path, notice: 'Fee structure was successfully created.'
    else
      render inertia: 'Admin/FeeStructures/New', props: {
        fee_structure: fee_structure_params,
        errors: @fee_structure.errors.full_messages,
        batches: get_batches_data,
        class_types: FeeStructure.class_types.keys,
        fee_types: FeeStructure.fee_types.keys
      }
    end
  end

  def edit
    batches = Batch.includes(:course).order(:name)
    batches_data = batches.map do |batch|
      {
        value: batch.id,
        label: "#{batch.name} (#{batch.course.name})"
      }
    end

    render inertia: 'Admin/FeeStructures/Edit', props: {
      fee_structure: {
        id: @fee_structure.id,
        batch_id: @fee_structure.batch_id,
        class_type: @fee_structure.class_type,
        fee_type: @fee_structure.fee_type,
        amount: @fee_structure.amount,
        effective_from: @fee_structure.effective_from,
        effective_to: @fee_structure.effective_to
      },
      batches: batches_data,
      class_types: FeeStructure.class_types.keys,
      fee_types: FeeStructure.fee_types.keys
    }
  end

  def update
    # Validate no overlap with existing fee structures (excluding current one)
    temp_fee_structure = @fee_structure.dup
    temp_fee_structure.assign_attributes(fee_structure_params)

    if overlapping_fee_structure?(temp_fee_structure, @fee_structure.id)
      render inertia: 'Admin/FeeStructures/Edit', props: {
        fee_structure: fee_structure_params.merge(id: @fee_structure.id),
        errors: ['A fee structure with overlapping dates already exists for this batch and class type'],
        batches: get_batches_data,
        class_types: FeeStructure.class_types.keys,
        fee_types: FeeStructure.fee_types.keys
      }
      return
    end

    if @fee_structure.update(fee_structure_params)
      redirect_to admin_fee_structures_path, notice: 'Fee structure was successfully updated.'
    else
      render inertia: 'Admin/FeeStructures/Edit', props: {
        fee_structure: fee_structure_params.merge(id: @fee_structure.id),
        errors: @fee_structure.errors.full_messages,
        batches: get_batches_data,
        class_types: FeeStructure.class_types.keys,
        fee_types: FeeStructure.fee_types.keys
      }
    end
  end

  def destroy
    if @fee_structure.destroy
      redirect_to admin_fee_structures_path, notice: 'Fee structure was successfully deleted.'
    else
      redirect_to admin_fee_structures_path, alert: 'Failed to delete fee structure.'
    end
  end

  private

  def set_fee_structure
    @fee_structure = FeeStructure.find(params[:id])
  end

  def authenticate_admin!
    unless current_user&.admin?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def fee_structure_params
    params.require(:fee_structure).permit(
      :batch_id,
      :class_type,
      :fee_type,
      :amount,
      :effective_from,
      :effective_to
    )
  end

  def get_batches_data
    Batch.active.includes(:course).order(:name).map do |batch|
      {
        value: batch.id,
        label: "#{batch.name} (#{batch.course.name})"
      }
    end
  end

  def overlapping_fee_structure?(fee_structure, exclude_id = nil)
    query = FeeStructure
      .where(batch_id: fee_structure.batch_id)
      .where(class_type: fee_structure.class_type)

    query = query.where.not(id: exclude_id) if exclude_id

    # Check for overlaps
    query.any? do |existing|
      # New fee structure starts before existing ends (or existing has no end date)
      starts_during = fee_structure.effective_from <= (existing.effective_to || Date.new(9999, 12, 31))

      # New fee structure ends after existing starts (or new has no end date)
      ends_during = (fee_structure.effective_to || Date.new(9999, 12, 31)) >= existing.effective_from

      starts_during && ends_during
    end
  end
end
