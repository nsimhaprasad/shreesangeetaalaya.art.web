class Student::LearningResourcesController < ApplicationController
  before_action :authenticate_student!
  before_action :set_learning_resource, only: [:show]

  def index
    authorize LearningResource
    student = current_user.student

    # Get resources assigned to the student directly or through their batches
    direct_assignments = ResourceAssignment
      .for_student
      .where(assignable_id: student.id)
      .includes(:learning_resource)

    batch_assignments = ResourceAssignment
      .for_batch
      .where(assignable_id: student.batch_enrollments.pluck(:batch_id))
      .includes(:learning_resource)

    all_assignments = (direct_assignments + batch_assignments).uniq { |a| a.learning_resource_id }

    # Filter by type
    if params[:resource_type].present?
      all_assignments = all_assignments.select do |assignment|
        assignment.learning_resource.resource_type == params[:resource_type]
      end
    end

    # Filter by tag
    if params[:tag].present?
      all_assignments = all_assignments.select do |assignment|
        assignment.learning_resource.tag_list.include?(params[:tag])
      end
    end

    # Filter by priority
    if params[:priority].present?
      all_assignments = all_assignments.select do |assignment|
        assignment.priority == params[:priority]
      end
    end

    # Filter by due date status
    case params[:due_status]
    when 'overdue'
      all_assignments = all_assignments.select(&:overdue?)
    when 'upcoming'
      all_assignments = all_assignments.select(&:upcoming?)
    end

    # Search
    if params[:search].present?
      search_term = params[:search].downcase
      all_assignments = all_assignments.select do |assignment|
        assignment.learning_resource.title.downcase.include?(search_term) ||
        assignment.learning_resource.description&.downcase&.include?(search_term)
      end
    end

    # Sorting
    all_assignments = case params[:sort]
    when 'title'
      all_assignments.sort_by { |a| a.learning_resource.title }
    when 'type'
      all_assignments.sort_by { |a| a.learning_resource.resource_type }
    when 'due_date'
      all_assignments.sort_by { |a| a.due_date || Time.current + 100.years }
    when 'priority'
      priority_order = { 'urgent' => 0, 'high' => 1, 'medium' => 2, 'low' => 3 }
      all_assignments.sort_by { |a| priority_order[a.priority] || 4 }
    else # 'recent' or default
      all_assignments.sort_by(&:assigned_at).reverse
    end

    # Pagination
    page = (params[:page] || 1).to_i
    per_page = 20
    total_count = all_assignments.count
    paginated_assignments = all_assignments.slice((page - 1) * per_page, per_page) || []

    resources_data = paginated_assignments.map do |assignment|
      resource = assignment.learning_resource
      {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        resource_type: resource.resource_type,
        is_youtube: resource.is_youtube,
        tags: resource.tag_list,
        has_file: resource.has_file?,
        has_url: resource.has_url?,
        assignment: {
          id: assignment.id,
          assigned_at: assignment.assigned_at,
          assigned_via: assignment.assignable_type,
          assigned_via_name: assignment.assignable.respond_to?(:full_name) ? assignment.assignable.full_name : assignment.assignable.name,
          notes: assignment.notes,
          due_date: assignment.due_date,
          priority: assignment.priority,
          overdue: assignment.overdue?,
          days_until_due: assignment.days_until_due
        }
      }
    end

    # Get all available tags from assigned resources
    all_tags = all_assignments
      .map { |a| a.learning_resource.tag_list }
      .flatten
      .uniq
      .sort

    render inertia: 'Student/LearningResources/Index', props: {
      resources: resources_data,
      filters: {
        search: params[:search],
        resource_type: params[:resource_type],
        tag: params[:tag],
        priority: params[:priority],
        due_status: params[:due_status],
        sort: params[:sort]
      },
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      available_tags: all_tags,
      resource_types: LearningResource.resource_types.keys,
      priorities: ResourceAssignment.priorities.keys,
      stats: {
        total: total_count,
        overdue: all_assignments.count(&:overdue?),
        high_priority: all_assignments.count { |a| ['high', 'urgent'].include?(a.priority) }
      }
    }
  end

  def show
    authorize @learning_resource

    student = current_user.student

    # Find the assignment for this student
    assignment = ResourceAssignment
      .where(learning_resource: @learning_resource)
      .where("(assignable_type = 'Student' AND assignable_id = ?) OR (assignable_type = 'Batch' AND assignable_id IN (?))",
             student.id, student.batch_enrollments.pluck(:batch_id))
      .first

    resource_data = {
      id: @learning_resource.id,
      title: @learning_resource.title,
      description: @learning_resource.description,
      resource_type: @learning_resource.resource_type,
      resource_url: @learning_resource.resource_url,
      is_youtube: @learning_resource.is_youtube,
      youtube_embed_url: @learning_resource.youtube_embed_url,
      tags: @learning_resource.tag_list,
      created_at: @learning_resource.created_at,
      has_file: @learning_resource.has_file?,
      has_url: @learning_resource.has_url?,
      file_name: @learning_resource.file_name,
      file_size: @learning_resource.file_size,
      file_url: @learning_resource.has_file? ? url_for(@learning_resource.file_attachment) : nil
    }

    assignment_data = if assignment
      {
        id: assignment.id,
        assigned_at: assignment.assigned_at,
        assigned_via: assignment.assignable_type,
        assigned_via_name: assignment.assignable.respond_to?(:full_name) ? assignment.assignable.full_name : assignment.assignable.name,
        notes: assignment.notes,
        due_date: assignment.due_date,
        priority: assignment.priority,
        overdue: assignment.overdue?,
        days_until_due: assignment.days_until_due
      }
    else
      nil
    end

    render inertia: 'Student/LearningResources/Show', props: {
      resource: resource_data,
      assignment: assignment_data
    }
  end

  private

  def set_learning_resource
    @learning_resource = LearningResource.find(params[:id])
  end

  def authenticate_student!
    unless current_user&.student?
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
