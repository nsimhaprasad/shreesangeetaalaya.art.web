class Student::CoursesController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_student
    before_action :set_student
    before_action :set_course, only: [:show]

    def index
      @enrollments = @student.batch_enrollments.includes(:batch, batch: [:course, :teacher])

      # Build enrollment data with all necessary information
      enrollments_data = @enrollments.map do |enrollment|
        batch = enrollment.batch
        course = batch.course

        # Calculate progress
        total_sessions = ClassSession.where(batch_id: batch.id).count
        completed_sessions = @student.attendances.where(batch_id: batch.id, status: 'present').count
        progress_percentage = total_sessions > 0 ? (completed_sessions.to_f / total_sessions * 100).round(2) : 0

        # Calculate attendance
        total_attended = @student.attendances.where(batch_id: batch.id).count
        present_count = @student.attendances.where(batch_id: batch.id, status: 'present').count
        attendance_percentage = total_attended > 0 ? (present_count.to_f / total_attended * 100).round(2) : 0

        # Count resources
        resource_count = course.learning_resources.count

        {
          id: enrollment.id,
          course_id: course.id,
          course_name: course.name,
          course_description: course.description,
          batch_id: batch.id,
          batch_name: batch.name,
          status: enrollment.status,
          enrollment_date: enrollment.created_at,
          difficulty_level: course.difficulty_level,
          duration_months: course.duration_months,
          progress_percentage: progress_percentage,
          completed_sessions: completed_sessions,
          total_sessions: total_sessions,
          attendance_percentage: attendance_percentage,
          resource_count: resource_count,
          schedule: batch.schedule
        }
      end

      render inertia: 'Student/Courses/Index', props: {
        enrollments: enrollments_data,
        courses: Course.all.select(:id, :name),
        batches: Batch.all.select(:id, :name, :course_id)
      }
    end

    def show
      # Get all batches for this course that the student is enrolled in
      @batches = @student.batches.where(course_id: @course.id).includes(:teacher)

      # Get enrollment information
      enrollment = @student.batch_enrollments
        .joins(:batch)
        .where(batches: { course_id: @course.id })
        .first

      # Calculate progress stats
      batch_ids = @batches.pluck(:id)
      total_sessions = ClassSession.where(batch_id: batch_ids).count
      completed_sessions = @student.attendances.where(batch_id: batch_ids, status: 'present').count
      progress_percentage = total_sessions > 0 ? (completed_sessions.to_f / total_sessions * 100).round(2) : 0

      # Calculate attendance stats
      total_attended = @student.attendances.where(batch_id: batch_ids).count
      present_count = @student.attendances.where(batch_id: batch_ids, status: 'present').count
      attendance_percentage = total_attended > 0 ? (present_count.to_f / total_attended * 100).round(2) : 0

      # Get upcoming sessions
      upcoming_sessions = ClassSession
        .where(batch_id: batch_ids)
        .where('date >= ?', Date.today)
        .order(:date, :start_time)
        .limit(10)
        .map do |session|
          {
            id: session.id,
            date: session.date,
            start_time: session.start_time,
            end_time: session.end_time,
            topic: session.topic,
            batch_name: session.batch.name,
            batch_id: session.batch_id
          }
        end

      # Get recent attendance
      recent_attendance = @student.attendances
        .where(batch_id: batch_ids)
        .order(date: :desc)
        .limit(10)
        .map do |attendance|
          {
            id: attendance.id,
            date: attendance.date,
            status: attendance.status,
            batch_name: attendance.batch.name,
            course_name: @course.name
          }
        end

      # Get learning resources
      learning_resources = @course.learning_resources.map do |resource|
        {
          id: resource.id,
          title: resource.title,
          resource_type: resource.resource_type,
          created_at: resource.created_at
        }
      end

      # Build batches data
      batches_data = @batches.map do |batch|
        {
          id: batch.id,
          name: batch.name,
          status: batch.status,
          start_date: batch.start_date,
          end_date: batch.end_date,
          schedule: batch.schedule,
          teacher_name: batch.teacher&.name
        }
      end

      render inertia: 'Student/Courses/Show', props: {
        course: {
          id: @course.id,
          name: @course.name,
          description: @course.description,
          difficulty_level: @course.difficulty_level,
          duration_months: @course.duration_months
        },
        enrollment: {
          status: enrollment&.status || 'active',
          enrollment_date: enrollment&.created_at
        },
        batches: batches_data,
        upcoming_sessions: upcoming_sessions,
        recent_attendance: recent_attendance,
        learning_resources: learning_resources,
        progress_stats: {
          progress_percentage: progress_percentage,
          completed_sessions: completed_sessions,
          total_sessions: total_sessions,
          attendance_percentage: attendance_percentage,
          present_count: present_count
        }
      }
    end

    private

    def ensure_student
      unless current_user.role == 'student'
        redirect_to root_path, alert: 'Access denied.'
      end
    end

    def set_student
      @student = current_user.student
    end

    def set_course
      @course = Course.find(params[:id])
    end
end
