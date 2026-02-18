# frozen_string_literal: true

module Admin
  class ReportsController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_admin!

    def index
      render inertia: 'Admin/Reports/Index', props: {
        summary: dashboard_summary
      }
    end

    def earnings
      start_date = params[:start_date] ? Date.parse(params[:start_date]) : 6.months.ago
      end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today

      render inertia: 'Admin/Reports/Earnings', props: {
        earnings_data: calculate_earnings_data(start_date, end_date),
        monthly_breakdown: monthly_earnings_breakdown(start_date, end_date),
        six_month_trend: six_month_trend,
        amortized_earnings: calculate_amortized_earnings,
        revenue_by_course: revenue_by_course,
        payment_methods: payment_method_breakdown,
        outstanding_dues: calculate_outstanding_dues
      }
    end

    def attendance
      start_date = params[:start_date] ? Date.parse(params[:start_date]) : 1.month.ago
      end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today

      render inertia: 'Admin/Reports/Attendance', props: {
        batch_wise_attendance: batch_wise_attendance(start_date, end_date),
        student_wise_attendance: student_wise_attendance(start_date, end_date),
        attendance_trends: attendance_trends(start_date, end_date),
        low_attendance_alerts: low_attendance_alerts,
        attendance_by_day: attendance_by_day_of_week(start_date, end_date)
      }
    end

    def students
      render inertia: 'Admin/Reports/Students', props: {
        active_students: active_students_count,
        enrollment_trends: enrollment_trends,
        course_popularity: course_popularity_report,
        student_growth: student_growth_rate,
        retention_rate: calculate_retention_rate,
        demographics: student_demographics
      }
    end

    def batch_performance
      render inertia: 'Admin/Reports/BatchPerformance', props: {
        batches: batch_performance_metrics,
        completion_rates: batch_completion_rates,
        attendance_averages: batch_attendance_averages,
        revenue_per_batch: batch_revenue,
        active_vs_completed: active_vs_completed_batches
      }
    end

    private

    def ensure_admin!
      redirect_to root_path, alert: 'Access denied.' unless current_user.admin?
    end

    def dashboard_summary
      {
        total_students: User.where(role: 'student').count,
        active_batches: Batch.where(status: 'active').count,
        total_revenue: Payment.where(status: 'completed').sum(:amount),
        average_attendance: calculate_average_attendance
      }
    end

    # Earnings methods
    def calculate_earnings_data(start_date, end_date)
      payments = Payment.where(status: 'completed')
                       .where(payment_date: start_date..end_date)

      {
        total_earnings: payments.sum(:amount),
        total_transactions: payments.count,
        average_transaction: payments.average(:amount)&.round(2) || 0,
        period: {
          start_date: start_date,
          end_date: end_date
        }
      }
    end

    def monthly_earnings_breakdown(start_date, end_date)
      Payment.where(status: 'completed')
             .where(payment_date: start_date..end_date)
             .group("DATE_TRUNC('month', payment_date)")
             .select("DATE_TRUNC('month', payment_date) as month, SUM(amount) as total, COUNT(*) as count")
             .order('month')
             .map do |record|
        {
          month: record.month.strftime('%B %Y'),
          total: record.total.to_f,
          count: record.count,
          average: (record.total.to_f / record.count).round(2)
        }
      end
    end

    def six_month_trend
      start_date = 6.months.ago.beginning_of_month
      end_date = Date.today.end_of_month

      Payment.where(status: 'completed')
             .where(payment_date: start_date..end_date)
             .group("DATE_TRUNC('month', payment_date)")
             .select("DATE_TRUNC('month', payment_date) as month, SUM(amount) as total")
             .order('month')
             .map do |record|
        {
          month: record.month.strftime('%b %Y'),
          amount: record.total.to_f
        }
      end
    end

    def calculate_amortized_earnings
      # Calculate per-class earnings for each course
      Batch.where(status: ['active', 'completed']).map do |batch|
        total_revenue = batch.payments.where(status: 'completed').sum(:amount)
        total_classes = batch.class_sessions.count

        {
          batch_name: batch.name,
          course_name: batch.course.name,
          total_revenue: total_revenue.to_f,
          total_classes: total_classes,
          per_class_revenue: total_classes > 0 ? (total_revenue.to_f / total_classes).round(2) : 0
        }
      end
    end

    def revenue_by_course
      Course.joins(batches: :payments)
            .where(payments: { status: 'completed' })
            .group('courses.id', 'courses.name')
            .select('courses.name, SUM(payments.amount) as total_revenue, COUNT(DISTINCT batches.id) as batch_count')
            .map do |course|
        {
          course_name: course.name,
          revenue: course.total_revenue.to_f,
          batches: course.batch_count
        }
      end
    end

    def payment_method_breakdown
      Payment.where(status: 'completed')
             .group(:payment_method)
             .select('payment_method, SUM(amount) as total, COUNT(*) as count')
             .map do |record|
        {
          method: record.payment_method || 'Not Specified',
          total: record.total.to_f,
          count: record.count
        }
      end
    end

    def calculate_outstanding_dues
      # Calculate total fees vs total payments for each student
      students_with_dues = User.where(role: 'student').map do |student|
        total_fees = student.batch_enrollments.joins(:batch).sum('batches.fee')
        total_paid = student.payments.where(status: 'completed').sum(:amount)
        outstanding = total_fees - total_paid

        next if outstanding <= 0

        {
          student_id: student.id,
          student_name: student.name,
          total_fees: total_fees.to_f,
          total_paid: total_paid.to_f,
          outstanding: outstanding.to_f
        }
      end.compact

      {
        total_outstanding: students_with_dues.sum { |s| s[:outstanding] },
        students_count: students_with_dues.count,
        students: students_with_dues.sort_by { |s| -s[:outstanding] }.take(10)
      }
    end

    # Attendance methods
    def batch_wise_attendance(start_date, end_date)
      Batch.where(status: ['active', 'completed']).map do |batch|
        sessions = batch.class_sessions.where(session_date: start_date..end_date)
        total_sessions = sessions.count
        total_possible = total_sessions * batch.batch_enrollments.count

        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { id: sessions.ids })
                            .where(status: 'present')
                            .count

        {
          batch_id: batch.id,
          batch_name: batch.name,
          course_name: batch.course.name,
          total_sessions: total_sessions,
          students_count: batch.batch_enrollments.count,
          attendance_percentage: total_possible > 0 ? ((attended.to_f / total_possible) * 100).round(2) : 0
        }
      end
    end

    def student_wise_attendance(start_date, end_date)
      User.where(role: 'student').joins(batch_enrollments: { batch: :class_sessions })
          .where(class_sessions: { session_date: start_date..end_date })
          .group('users.id', 'users.name', 'users.email')
          .select('users.id, users.name, users.email, COUNT(DISTINCT class_sessions.id) as total_sessions')
          .limit(50)
          .map do |student|
        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { session_date: start_date..end_date })
                            .where(student_id: student.id, status: 'present')
                            .count

        {
          student_id: student.id,
          student_name: student.name,
          student_email: student.email,
          total_sessions: student.total_sessions,
          attended: attended,
          percentage: student.total_sessions > 0 ? ((attended.to_f / student.total_sessions) * 100).round(2) : 0
        }
      end
    end

    def attendance_trends(start_date, end_date)
      ClassSession.where(session_date: start_date..end_date)
                  .group("DATE_TRUNC('day', session_date)")
                  .select("DATE_TRUNC('day', session_date) as date, COUNT(*) as sessions")
                  .order('date')
                  .map do |record|
        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { session_date: record.date })
                            .where(status: 'present')
                            .count

        total_possible = ClassSession.where(session_date: record.date)
                                    .joins(batch: :batch_enrollments)
                                    .count

        {
          date: record.date.strftime('%Y-%m-%d'),
          sessions: record.sessions,
          attendance_rate: total_possible > 0 ? ((attended.to_f / total_possible) * 100).round(2) : 0
        }
      end
    end

    def low_attendance_alerts
      threshold = 60 # Alert if attendance is below 60%

      User.where(role: 'student').map do |student|
        total_sessions = ClassSession.joins(batch: :batch_enrollments)
                                    .where(batch_enrollments: { student_id: student.id })
                                    .where('session_date >= ?', 1.month.ago)
                                    .count

        attended = Attendance.where(student_id: student.id, status: 'present')
                            .joins(:class_session)
                            .where('class_sessions.session_date >= ?', 1.month.ago)
                            .count

        percentage = total_sessions > 0 ? ((attended.to_f / total_sessions) * 100).round(2) : 0

        next if percentage >= threshold || total_sessions == 0

        {
          student_id: student.id,
          student_name: student.name,
          student_email: student.email,
          attendance_percentage: percentage,
          total_sessions: total_sessions,
          attended: attended
        }
      end.compact.sort_by { |s| s[:attendance_percentage] }
    end

    def attendance_by_day_of_week(start_date, end_date)
      days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      (0..6).map do |day_num|
        sessions = ClassSession.where(session_date: start_date..end_date)
                              .where("EXTRACT(DOW FROM session_date) = ?", day_num)

        total_possible = sessions.joins(batch: :batch_enrollments).count

        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { id: sessions.ids })
                            .where(status: 'present')
                            .count

        {
          day: days[day_num],
          sessions_count: sessions.count,
          attendance_rate: total_possible > 0 ? ((attended.to_f / total_possible) * 100).round(2) : 0
        }
      end
    end

    # Student methods
    def active_students_count
      {
        total: User.where(role: 'student').count,
        active: User.where(role: 'student')
                   .joins(:batch_enrollments)
                   .where(batch_enrollments: { status: 'active' })
                   .distinct
                   .count,
        inactive: User.where(role: 'student')
                     .where.not(id: BatchEnrollment.where(status: 'active').select(:student_id))
                     .count
      }
    end

    def enrollment_trends
      last_12_months = (0..11).map do |i|
        date = i.months.ago.beginning_of_month

        {
          month: date.strftime('%b %Y'),
          enrollments: BatchEnrollment.where(
            'created_at >= ? AND created_at < ?',
            date,
            date.end_of_month
          ).count
        }
      end.reverse
    end

    def course_popularity_report
      Course.left_joins(batches: :batch_enrollments)
            .group('courses.id', 'courses.name')
            .select('courses.name, COUNT(DISTINCT batches.id) as batch_count, COUNT(batch_enrollments.id) as student_count')
            .order('student_count DESC')
            .map do |course|
        {
          course_name: course.name,
          batches: course.batch_count,
          students: course.student_count,
          avg_students_per_batch: course.batch_count > 0 ? (course.student_count.to_f / course.batch_count).round(2) : 0
        }
      end
    end

    def student_growth_rate
      current_month = User.where(role: 'student')
                         .where('created_at >= ?', 1.month.ago.beginning_of_month)
                         .count

      previous_month = User.where(role: 'student')
                          .where('created_at >= ? AND created_at < ?',
                                2.months.ago.beginning_of_month,
                                1.month.ago.beginning_of_month)
                          .count

      growth_rate = previous_month > 0 ? (((current_month - previous_month).to_f / previous_month) * 100).round(2) : 0

      {
        current_month: current_month,
        previous_month: previous_month,
        growth_rate: growth_rate,
        total_students: User.where(role: 'student').count
      }
    end

    def calculate_retention_rate
      # Students who enrolled more than 3 months ago and are still active
      old_students = User.where(role: 'student')
                        .where('created_at < ?', 3.months.ago)
                        .count

      retained_students = User.where(role: 'student')
                             .where('created_at < ?', 3.months.ago)
                             .joins(:batch_enrollments)
                             .where(batch_enrollments: { status: 'active' })
                             .distinct
                             .count

      {
        total_eligible: old_students,
        retained: retained_students,
        retention_rate: old_students > 0 ? ((retained_students.to_f / old_students) * 100).round(2) : 0
      }
    end

    def student_demographics
      # This is a placeholder - customize based on your actual student data fields
      {
        by_batch_count: User.where(role: 'student')
                           .left_joins(:batch_enrollments)
                           .group('users.id')
                           .select('COUNT(batch_enrollments.id) as batch_count')
                           .group('batch_count')
                           .count,
        average_batches_per_student: BatchEnrollment.count.to_f / [User.where(role: 'student').count, 1].max
      }
    end

    # Batch performance methods
    def batch_performance_metrics
      Batch.all.map do |batch|
        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name,
          status: batch.status,
          current_size: batch.batch_enrollments.count,
          capacity: batch.max_students || 0,
          occupancy_rate: batch.max_students && batch.max_students > 0 ?
                         ((batch.batch_enrollments.count.to_f / batch.max_students) * 100).round(2) : 0,
          start_date: batch.start_date,
          end_date: batch.end_date
        }
      end
    end

    def batch_completion_rates
      Batch.where(status: 'completed').map do |batch|
        total_sessions = batch.class_sessions.count
        students = batch.batch_enrollments.count

        students_completed = batch.batch_enrollments.where(status: 'completed').count

        {
          batch_name: batch.name,
          course_name: batch.course.name,
          total_students: students,
          completed: students_completed,
          completion_rate: students > 0 ? ((students_completed.to_f / students) * 100).round(2) : 0
        }
      end
    end

    def batch_attendance_averages
      Batch.all.map do |batch|
        sessions = batch.class_sessions
        total_possible = sessions.count * batch.batch_enrollments.count

        attended = Attendance.joins(:class_session)
                            .where(class_sessions: { batch_id: batch.id })
                            .where(status: 'present')
                            .count

        {
          batch_name: batch.name,
          course_name: batch.course.name,
          average_attendance: total_possible > 0 ? ((attended.to_f / total_possible) * 100).round(2) : 0,
          total_sessions: sessions.count
        }
      end
    end

    def batch_revenue
      Batch.all.map do |batch|
        total_revenue = batch.payments.where(status: 'completed').sum(:amount)

        {
          batch_name: batch.name,
          course_name: batch.course.name,
          students: batch.batch_enrollments.count,
          total_revenue: total_revenue.to_f,
          average_per_student: batch.batch_enrollments.count > 0 ?
                              (total_revenue.to_f / batch.batch_enrollments.count).round(2) : 0
        }
      end
    end

    def active_vs_completed_batches
      {
        active: Batch.where(status: 'active').count,
        completed: Batch.where(status: 'completed').count,
        upcoming: Batch.where(status: 'upcoming').count,
        total: Batch.count
      }
    end

    def calculate_average_attendance
      total_sessions = ClassSession.count
      return 0 if total_sessions == 0

      total_possible = ClassSession.joins(batch: :batch_enrollments).count
      return 0 if total_possible == 0

      attended = Attendance.where(status: 'present').count

      ((attended.to_f / total_possible) * 100).round(2)
    end
  end
end
