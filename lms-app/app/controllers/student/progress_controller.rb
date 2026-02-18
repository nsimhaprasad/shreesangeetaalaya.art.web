class Student::ProgressController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_student
    before_action :set_student

    def index
      # Get all enrollments
      enrollments_data = @student.batch_enrollments.includes(batch: [:course, :teacher]).map do |enrollment|
        batch = enrollment.batch
        course = batch.course

        {
          id: enrollment.id,
          course_id: course.id,
          course_name: course.name,
          batch_id: batch.id,
          batch_name: batch.name,
          status: enrollment.status,
          enrollment_date: enrollment.created_at
        }
      end

      # Calculate overall stats
      all_batch_ids = @student.batches.pluck(:id)
      total_sessions = ClassSession.where(batch_id: all_batch_ids).count
      completed_sessions = @student.attendances.where(batch_id: all_batch_ids, status: 'present').count
      overall_progress = total_sessions > 0 ? (completed_sessions.to_f / total_sessions * 100).round(2) : 0

      total_attendance = @student.attendances.where(batch_id: all_batch_ids).count
      present_count = @student.attendances.where(batch_id: all_batch_ids, status: 'present').count
      attendance_percentage = total_attendance > 0 ? (present_count.to_f / total_attendance * 100).round(2) : 0

      overall_stats = {
        overall_progress: overall_progress,
        attendance_percentage: attendance_percentage,
        completed_sessions: completed_sessions,
        total_sessions: total_sessions
      }

      # Calculate progress for each course
      course_progress = @student.batch_enrollments.includes(batch: :course).map do |enrollment|
        batch = enrollment.batch
        course = batch.course

        # Get all batches for this course
        course_batch_ids = @student.batches.where(course_id: course.id).pluck(:id)

        # Calculate progress
        total_sessions = ClassSession.where(batch_id: course_batch_ids).count
        completed_sessions = @student.attendances.where(batch_id: course_batch_ids, status: 'present').count
        progress_percentage = total_sessions > 0 ? (completed_sessions.to_f / total_sessions * 100).round(2) : 0

        # Calculate attendance
        total_attendance = @student.attendances.where(batch_id: course_batch_ids).count
        present = @student.attendances.where(batch_id: course_batch_ids, status: 'present').count
        absent = @student.attendances.where(batch_id: course_batch_ids, status: 'absent').count
        late = @student.attendances.where(batch_id: course_batch_ids, status: 'late').count
        excused = @student.attendances.where(batch_id: course_batch_ids, status: 'excused').count
        attendance_percentage = total_attendance > 0 ? (present.to_f / total_attendance * 100).round(2) : 0

        # Count resources
        total_resources = course.learning_resources.count
        resources_accessed = 0 # This could be tracked if you have a view/access tracking system

        {
          course_id: course.id,
          course_name: course.name,
          batch_id: batch.id,
          batch_name: batch.name,
          progress_percentage: progress_percentage,
          completed_sessions: completed_sessions,
          total_sessions: total_sessions,
          attendance_percentage: attendance_percentage,
          attendance_breakdown: {
            present: present,
            absent: absent,
            late: late,
            excused: excused
          },
          total_resources: total_resources,
          resources_accessed: resources_accessed,
          grade: nil, # You can add grade calculation if you have a grading system
          performance_notes: nil # You can add performance notes if available
        }
      end

      render inertia: 'Student/Progress/Index', props: {
        enrollments: enrollments_data,
        overall_stats: overall_stats,
        course_progress: course_progress
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
end
