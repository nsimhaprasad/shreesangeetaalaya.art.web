class Teacher::LearningResourcesController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_learning_resource, only: [:show, :edit, :update, :destroy]

  def index
    authorize LearningResource
    teacher = current_user.teacher

    # Base query - resources uploaded by the teacher
    resources = LearningResource
      .where(uploaded_by: current_user.id)
      .includes(:resource_assignments, :assigned_students, :assigned_batches)

    # Search
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      resources = resources.where(
        "title ILIKE ? OR description ILIKE ?",
        search_term, search_term
      )
    end

    # Filter by type
    if params[:resource_type].present?
      resources = resources.where(resource_type: params[:resource_type])
    end

    # Filter by visibility
    if params[:visibility].present?
      resources = resources.where(visibility: params[:visibility])
    end

    # Filter by tag
    if params[:tag].present?
      resources = resources.by_tag(params[:tag])
    end

    # Sorting
    resources = case params[:sort]
    when 'title'
      resources.order(title: :asc)
    when 'type'
      resources.order(resource_type: :asc)
    when 'oldest'
      resources.order(created_at: :asc)
    else # 'recent' or default
      resources.recent
    end

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = resources.count
    resources = resources.offset((page.to_i - 1) * per_page).limit(per_page)

    resources_data = resources.map do |resource|
      {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        resource_type: resource.resource_type,
        visibility: resource.visibility,
        is_youtube: resource.is_youtube,
        tags: resource.tag_list,
        created_at: resource.created_at,
        has_file: resource.has_file?,
        has_url: resource.has_url?,
        file_name: resource.file_name,
        file_size: resource.file_size,
        assignments_count: resource.resource_assignments.count,
        students_count: resource.resource_assignments.for_student.count,
        batches_count: resource.resource_assignments.for_batch.count
      }
    end

    # Get all available tags
    all_tags = LearningResource
      .where(uploaded_by: current_user.id)
      .where.not(tags: [nil, ''])
      .pluck(:tags)
      .flat_map { |t| JSON.parse(t) rescue [] }
      .uniq
      .sort

    render inertia: 'Teacher/LearningResources/Index', props: {
      resources: resources_data,
      filters: {
        search: params[:search],
        resource_type: params[:resource_type],
        visibility: params[:visibility],
        tag: params[:tag],
        sort: params[:sort]
      },
      pagination: {
        current_page: page.to_i,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      available_tags: all_tags,
      resource_types: LearningResource.resource_types.keys,
      visibilities: LearningResource.visibilities.keys
    }
  end

  def show
    authorize @learning_resource

    resource_data = {
      id: @learning_resource.id,
      title: @learning_resource.title,
      description: @learning_resource.description,
      resource_type: @learning_resource.resource_type,
      resource_url: @learning_resource.resource_url,
      visibility: @learning_resource.visibility,
      is_youtube: @learning_resource.is_youtube,
      youtube_embed_url: @learning_resource.youtube_embed_url,
      tags: @learning_resource.tag_list,
      created_at: @learning_resource.created_at,
      updated_at: @learning_resource.updated_at,
      has_file: @learning_resource.has_file?,
      has_url: @learning_resource.has_url?,
      file_name: @learning_resource.file_name,
      file_size: @learning_resource.file_size,
      file_url: @learning_resource.has_file? ? url_for(@learning_resource.file_attachment) : nil,
      uploaded_by: {
        id: @learning_resource.uploaded_by_user&.id,
        name: @learning_resource.uploaded_by_user&.full_name
      }
    }

    # Get assignments
    assignments = @learning_resource.resource_assignments.includes(:assignable, :assigned_by_user).map do |assignment|
      {
        id: assignment.id,
        assignable_type: assignment.assignable_type,
        assignable_id: assignment.assignable_id,
        assignable_name: assignment.assignable.respond_to?(:full_name) ? assignment.assignable.full_name : assignment.assignable.name,
        assigned_at: assignment.assigned_at,
        assigned_by: assignment.assigned_by_user&.full_name,
        notes: assignment.notes,
        due_date: assignment.due_date,
        priority: assignment.priority,
        overdue: assignment.overdue?,
        days_until_due: assignment.days_until_due
      }
    end

    render inertia: 'Teacher/LearningResources/Show', props: {
      resource: resource_data,
      assignments: assignments
    }
  end

  def new
    authorize LearningResource
    render inertia: 'Teacher/LearningResources/New', props: {
      resource: {
        title: '',
        description: '',
        resource_type: 'document',
        resource_url: '',
        visibility: 'private',
        is_youtube: false,
        tags: []
      },
      resource_types: LearningResource.resource_types.keys,
      visibilities: LearningResource.visibilities.keys
    }
  end

  def create
    authorize LearningResource

    @learning_resource = LearningResource.new(learning_resource_params)
    @learning_resource.uploaded_by = current_user.id

    # Handle tags
    if params[:learning_resource][:tags].present?
      @learning_resource.tag_list = params[:learning_resource][:tags]
    end

    if @learning_resource.save
      redirect_to teacher_learning_resource_path(@learning_resource), notice: 'Learning resource was successfully created.'
    else
      render inertia: 'Teacher/LearningResources/New', props: {
        resource: @learning_resource,
        errors: @learning_resource.errors.full_messages,
        resource_types: LearningResource.resource_types.keys,
        visibilities: LearningResource.visibilities.keys
      }
    end
  end

  def edit
    authorize @learning_resource
    render inertia: 'Teacher/LearningResources/Edit', props: {
      resource: {
        id: @learning_resource.id,
        title: @learning_resource.title,
        description: @learning_resource.description,
        resource_type: @learning_resource.resource_type,
        resource_url: @learning_resource.resource_url,
        visibility: @learning_resource.visibility,
        is_youtube: @learning_resource.is_youtube,
        tags: @learning_resource.tag_list,
        has_file: @learning_resource.has_file?,
        file_name: @learning_resource.file_name
      },
      resource_types: LearningResource.resource_types.keys,
      visibilities: LearningResource.visibilities.keys
    }
  end

  def update
    authorize @learning_resource

    # Handle tags
    if params[:learning_resource][:tags].present?
      @learning_resource.tag_list = params[:learning_resource][:tags]
    end

    if @learning_resource.update(learning_resource_params)
      redirect_to teacher_learning_resource_path(@learning_resource), notice: 'Learning resource was successfully updated.'
    else
      render inertia: 'Teacher/LearningResources/Edit', props: {
        resource: @learning_resource,
        errors: @learning_resource.errors.full_messages,
        resource_types: LearningResource.resource_types.keys,
        visibilities: LearningResource.visibilities.keys
      }
    end
  end

  def destroy
    authorize @learning_resource

    if @learning_resource.destroy
      redirect_to teacher_learning_resources_path, notice: 'Learning resource was successfully deleted.'
    else
      redirect_to teacher_learning_resource_path(@learning_resource), alert: 'Failed to delete learning resource.'
    end
  end

  private

  def set_learning_resource
    @learning_resource = LearningResource.find(params[:id])
  end

  def authenticate_teacher!
    unless current_user&.teacher?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def learning_resource_params
    params.require(:learning_resource).permit(
      :title,
      :description,
      :resource_type,
      :resource_url,
      :visibility,
      :is_youtube,
      :file_attachment
    )
  end
end
