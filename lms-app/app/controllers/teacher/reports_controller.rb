# frozen_string_literal: true

module Teacher
  class ReportsController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_teacher!

    def index
      render inertia: 'Teacher/Reports/Index', props: {
        summary: teacher_summary,
        batches: teacher_batches_data,
        recent_attendance: recent_attendance_data,
        earnings_overview: teacher_earnings_overview,
        student_performance: student_performance_overview
      }
    end

    private

    def ensure_teacher!
      redirect_to root_path, alert: 'Access denied.' unless current_user.teacher?
    end

    def teacher_summary
      teacher_batches = Batch.where(teacher_id: current_user.id)

      {
        total_batches: teacher_batches.count,
        active_batches: teacher_batches.where(status: 'active').count,
        total_students: BatchEnrollment.joins(:batch)
                                      .where(batches: { teacher_id: current_user.id })
                                      .distinct
                                      .count,
        total_classes: ClassSession.joins(:batch)
                                   .where(batches: { teacher_id: current_user.id })
                                   .count
      }
    end

    def teacher_batches_data
      Batch.where(teacher_id: current_user.id).map do |batch|
        total_sessions = batch.class_sessions.count
        students_count = batch.batch_enrollments.count
        total_possible = total_sessions * students_count

        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { batch_id: batch.id })
                            .where(status: 'present')
                            .count

        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name,
          status: batch.status,
          students_count: students_count,
          total_sessions: total_sessions,
          attendance_rate: total_possible > 0 ? ((attended.to_f / total_possible) * 100).round(2) : 0,
          start_date: batch.start_date,
          end_date: batch.end_date
        }
      end
    end

    def recent_attendance_data
      # Get attendance data for last 7 days
      start_date = 7.days.ago
      end_date = Date.today

      ClassSession.joins(:batch)
                  .where(batches: { teacher_id: current_user.id })
                  .where(session_date: start_date..end_date)
                  .order(session_date: :desc)
                  .limit(10)
                  .map do |session|
        total_students = session.batch.batch_enrollments.count
        attended = session.attendances.where(status: 'present').count

        {
          id: session.id,
          batch_name: session.batch.name,
          session_date: session.session_date,
          topic: session.topic,
          total_students: total_students,
          attended: attended,
          attendance_rate: total_students > 0 ? ((attended.to_f / total_students) * 100).round(2) : 0
        }
      end
    end

    def teacher_earnings_overview
      # Calculate earnings from teacher's batches
      batches = Batch.where(teacher_id: current_user.id)

      total_revenue = Payment.joins(student: :batch_enrollments)
                            .where(batch_enrollments: { batch_id: batches.ids })
                            .where(status: 'completed')
                            .sum(:amount)

      monthly_revenue = Payment.joins(student: :batch_enrollments)
                              .where(batch_enrollments: { batch_id: batches.ids })
                              .where(status: 'completed')
                              .where('payment_date >= ?', 1.month.ago.beginning_of_month)
                              .sum(:amount)

      # Last 6 months trend
      trend = (0..5).map do |i|
        date = i.months.ago.beginning_of_month
        revenue = Payment.joins(student: :batch_enrollments)
                        .where(batch_enrollments: { batch_id: batches.ids })
                        .where(status: 'completed')
                        .where('payment_date >= ? AND payment_date < ?', date, date.end_of_month)
                        .sum(:amount)

        {
          month: date.strftime('%b %Y'),
          amount: revenue.to_f
        }
      end.reverse

      {
        total_revenue: total_revenue.to_f,
        monthly_revenue: monthly_revenue.to_f,
        trend: trend,
        batches_count: batches.count
      }
    end

    def student_performance_overview
      # Get students from teacher's batches with their attendance
      batches = Batch.where(teacher_id: current_user.id)
      students = User.where(role: 'student')
                    .joins(:batch_enrollments)
                    .where(batch_enrollments: { batch_id: batches.ids })
                    .distinct

      students_data = students.limit(20).map do |student|
        total_sessions = ClassSession.joins(:batch)
                                    .where(batches: { teacher_id: current_user.id })
                                    .joins(:batch_enrollments)
                                    .where(batch_enrollments: { student_id: student.id })
                                    .count

        attended = Attendance.where(student_id: student.id, status: 'present')
                            .joins(:class_session)
                            .joins(class_session: :batch)
                            .where(batches: { teacher_id: current_user.id })
                            .count

        {
          student_name: student.name,
          student_email: student.email,
          total_sessions: total_sessions,
          attended: attended,
          attendance_rate: total_sessions > 0 ? ((attended.to_f / total_sessions) * 100).round(2) : 0
        }
      end

      {
        total_students: students.count,
        students: students_data,
        average_attendance: students_data.any? ? (students_data.sum { |s| s[:attendance_rate] } / students_data.count).round(2) : 0
      }
    end
  end
end
