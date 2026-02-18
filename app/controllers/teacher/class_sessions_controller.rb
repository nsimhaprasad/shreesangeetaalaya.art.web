class Teacher::ClassSessionsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_class_session, only: [:show, :edit, :update, :destroy]

  def index
    teacher = current_user.teacher

    # Get date range from params or default to current month
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today.end_of_month

    # Fetch class sessions for teacher's batches
    class_sessions = ClassSession.joins(:batch)
      .where(batches: { teacher_id: teacher.id })
      .where('class_date >= ? AND class_date <= ?', start_date, end_date)
      .includes(:batch)
      .order(:class_date, :class_time)

    sessions_data = class_sessions.map do |session|
      {
        id: session.id,
        batch_id: session.batch_id,
        batch_name: session.batch.name,
        class_date: session.class_date,
        class_time: session.class_time,
        duration_minutes: session.duration_minutes,
        topic: session.topic,
        status: session.status,
        location: session.location,
        meeting_link: session.meeting_link
      }
    end

    batches = teacher.batches.active.map do |batch|
      {
        value: batch.id,
        label: batch.name,
        course_name: batch.course.name
      }
    end

    render inertia: 'Teacher/ClassSessions/Index', props: {
      sessions: sessions_data,
      batches: batches,
      start_date: start_date,
      end_date: end_date
    }
  end

  def show
    session_data = {
      id: @class_session.id,
      batch: {
        id: @class_session.batch.id,
        name: @class_session.batch.name,
        course_name: @class_session.batch.course.name
      },
      class_date: @class_session.class_date,
      class_time: @class_session.class_time,
      duration_minutes: @class_session.duration_minutes,
      topic: @class_session.topic,
      description: @class_session.description,
      status: @class_session.status,
      location: @class_session.location,
      meeting_link: @class_session.meeting_link,
      homework: @class_session.homework,
      notes: @class_session.notes,
      attendances: @class_session.attendances.includes(student: :user).map do |attendance|
        {
          id: attendance.id,
          student_name: attendance.student.user.full_name,
          status: attendance.status,
          remarks: attendance.remarks
        }
      end
    }

    render inertia: 'Teacher/ClassSessions/Show', props: { session: session_data }
  end

  def new
    batches = current_user.teacher.batches.active.map do |batch|
      {
        value: batch.id,
        label: batch.name,
        course_name: batch.course.name
      }
    end

    render inertia: 'Teacher/ClassSessions/Form', props: {
      session: nil,
      batches: batches,
      is_edit: false
    }
  end

  def new_recurring
    batches = current_user.teacher.batches.active.map do |batch|
      {
        value: batch.id,
        label: batch.name,
        course_name: batch.course.name,
        schedule: batch.schedule
      }
    end

    render inertia: 'Teacher/ClassSessions/RecurringForm', props: {
      batches: batches
    }
  end

  def create
    @class_session = ClassSession.new(class_session_params)

    # Verify batch belongs to current teacher
    unless current_user.teacher.batches.exists?(@class_session.batch_id)
      redirect_to teacher_class_sessions_path, alert: 'Access denied.'
      return
    end

    if @class_session.save
      redirect_to teacher_class_sessions_path, notice: 'Class session created successfully.'
    else
      batches = current_user.teacher.batches.active.map do |batch|
        {
          value: batch.id,
          label: batch.name,
          course_name: batch.course.name
        }
      end

      render inertia: 'Teacher/ClassSessions/Form', props: {
        session: @class_session.as_json.merge(errors: @class_session.errors.full_messages),
        batches: batches,
        is_edit: false
      }
    end
  end

  def create_recurring
    batch = current_user.teacher.batches.find(params[:batch_id])

    start_date = Date.parse(params[:start_date])
    end_date = Date.parse(params[:end_date])
    class_time = params[:class_time]
    duration_minutes = params[:duration_minutes].to_i
    days_of_week = params[:days_of_week] || []

    created_sessions = []
    errors = []

    current_date = start_date
    while current_date <= end_date
      if days_of_week.include?(current_date.wday.to_s)
        session = batch.class_sessions.build(
          class_date: current_date,
          class_time: class_time,
          duration_minutes: duration_minutes,
          topic: params[:topic],
          description: params[:description],
          location: params[:location],
          meeting_link: params[:meeting_link],
          status: 'scheduled'
        )

        if session.save
          created_sessions << session
        else
          errors << "Failed to create session on #{current_date}: #{session.errors.full_messages.join(', ')}"
        end
      end

      current_date += 1.day
    end

    if created_sessions.any?
      redirect_to teacher_class_sessions_path, notice: "Created #{created_sessions.count} class sessions successfully. #{errors.join('. ')}"
    else
      redirect_to new_recurring_teacher_class_sessions_path, alert: "Failed to create sessions: #{errors.join('. ')}"
    end
  end

  def edit
    batches = current_user.teacher.batches.active.map do |batch|
      {
        value: batch.id,
        label: batch.name,
        course_name: batch.course.name
      }
    end

    render inertia: 'Teacher/ClassSessions/Form', props: {
      session: @class_session.as_json,
      batches: batches,
      is_edit: true
    }
  end

  def update
    if @class_session.update(class_session_params)
      redirect_to teacher_class_sessions_path, notice: 'Class session updated successfully.'
    else
      batches = current_user.teacher.batches.active.map do |batch|
        {
          value: batch.id,
          label: batch.name,
          course_name: batch.course.name
        }
      end

      render inertia: 'Teacher/ClassSessions/Form', props: {
        session: @class_session.as_json.merge(errors: @class_session.errors.full_messages),
        batches: batches,
        is_edit: true
      }
    end
  end

  def destroy
    @class_session.destroy
    redirect_to teacher_class_sessions_path, notice: 'Class session deleted successfully.'
  end

  private

  def set_class_session
    @class_session = ClassSession.joins(:batch)
      .where(batches: { teacher_id: current_user.teacher.id })
      .find(params[:id])
  end

  def class_session_params
    params.require(:class_session).permit(
      :batch_id,
      :class_date,
      :class_time,
      :duration_minutes,
      :topic,
      :description,
      :status,
      :location,
      :meeting_link,
      :homework,
      :notes
    )
  end

  def authenticate_teacher!
    unless current_user.role == 'teacher'
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end
