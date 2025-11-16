class Student::DashboardController < ApplicationController
  before_action :authenticate_student!
  before_action :set_student

  def index
    # Get student batches
    batch_ids = @student.batches.pluck(:id)

    # Calculate overall stats
    enrolled_courses = @student.batches.joins(:course).distinct.count('courses.id')
    total_attendance = @student.attendances.count
    present_count = @student.attendances.where(status: 'present').count
    attendance_percentage = total_attendance > 0 ? (present_count.to_f / total_attendance * 100).round(2) : 0

    # Classes this week
    start_of_week = Date.today.beginning_of_week
    end_of_week = Date.today.end_of_week
    classes_this_week = ClassSession.where(batch_id: batch_ids)
                                    .where(date: start_of_week..end_of_week)
                                    .count

    # Outstanding dues
    outstanding_dues = @student.pending_payments || 0

    stats = {
      enrolled_courses: enrolled_courses,
      attendance_percentage: attendance_percentage,
      classes_this_week: classes_this_week,
      outstanding_dues: outstanding_dues
    }

    # Upcoming classes (next 7 days)
    upcoming_classes = ClassSession
      .where(batch_id: batch_ids)
      .where('date >= ? AND date <= ?', Date.today, Date.today + 7.days)
      .order(:date, :start_time)
      .includes(batch: :course)
      .limit(5)
      .map do |session|
        {
          id: session.id,
          date: session.date,
          start_time: session.start_time&.strftime('%H:%M'),
          end_time: session.end_time&.strftime('%H:%M'),
          course_name: session.batch.course.name,
          batch_name: session.batch.name,
          topic: session.topic
        }
      end

    # Recent attendance (last 5 records)
    recent_attendance = @student.attendances
      .order(date: :desc)
      .limit(5)
      .includes(batch: :course)
      .map do |attendance|
        {
          id: attendance.id,
          date: attendance.date,
          status: attendance.status,
          course_name: attendance.batch.course.name,
          batch_name: attendance.batch.name
        }
      end

    # Payment status
    payment_status = {
      outstanding: outstanding_dues,
      total_paid: @student.total_paid || 0,
      last_payment: @student.last_payment_date
    }

    # Recent learning resources (last 5)
    recent_resources = LearningResource
      .joins(resource_assignments: :batch_enrollments)
      .where(resource_assignments: { assignable: @student.batch_enrollments })
      .distinct
      .order(created_at: :desc)
      .limit(5)
      .map do |resource|
        {
          id: resource.id,
          title: resource.title,
          resource_type: resource.resource_type,
          course_name: resource.course&.name,
          created_at: resource.created_at
        }
      end

    # Course progress
    course_progress = @student.batches.joins(:course).distinct.map do |batch|
      course = batch.course
      course_batch_ids = @student.batches.where(course_id: course.id).pluck(:id)

      total_sessions = ClassSession.where(batch_id: course_batch_ids).count
      completed_sessions = @student.attendances.where(batch_id: course_batch_ids, status: 'present').count
      progress_percentage = total_sessions > 0 ? (completed_sessions.to_f / total_sessions * 100).round(2) : 0

      {
        course_id: course.id,
        course_name: course.name,
        batch_name: batch.name,
        progress_percentage: progress_percentage,
        completed_sessions: completed_sessions,
        total_sessions: total_sessions
      }
    end.uniq { |cp| cp[:course_id] }

    # Recent activities
    recent_activities = []

    # Add recent attendance to activities
    @student.attendances.order(date: :desc).limit(3).each do |attendance|
      recent_activities << {
        type: 'attendance',
        description: "Marked #{attendance.status} for #{attendance.batch.course.name}",
        date: attendance.date
      }
    end

    # Add recent payments to activities
    @student.payments.where(status: 'completed').order(created_at: :desc).limit(2).each do |payment|
      recent_activities << {
        type: 'payment',
        description: "Payment of ₹#{payment.amount} received",
        date: payment.created_at
      }
    end

    # Add recent resources to activities
    recent_resources.first(2).each do |resource|
      recent_activities << {
        type: 'resource',
        description: "New resource added: #{resource[:title]}",
        date: resource[:created_at]
      }
    end

    # Sort activities by date
    recent_activities = recent_activities.sort_by { |a| a[:date] }.reverse.first(10)

    render inertia: 'Student/Dashboard', props: {
      student: {
        id: @student.id,
        name: @student.name,
        email: @student.email
      },
      stats: stats,
      upcoming_classes: upcoming_classes,
      recent_attendance: recent_attendance,
      payment_status: payment_status,
      recent_resources: recent_resources,
      course_progress: course_progress,
      recent_activities: recent_activities,
      outstanding_dues: outstanding_dues
    }
  end

  private

  def authenticate_student!
    unless current_user.role == 'student'
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def set_student
    @student = current_user.student
  end
end
