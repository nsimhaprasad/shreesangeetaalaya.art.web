class Teacher::StudentsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_student, only: [:show, :edit, :update, :destroy]

  def index
    authorize Student
    teacher = current_user.teacher

    # Base query - students in teacher's batches
    students = policy_scope(Student)
      .includes(:user, batch_enrollments: :batch, payments: [], attendances: [])
      .distinct

    # Search
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      students = students.joins(:user).where(
        "users.first_name ILIKE ? OR users.last_name ILIKE ? OR users.email ILIKE ? OR users.phone ILIKE ?",
        search_term, search_term, search_term, search_term
      )
    end

    # Filter by status
    if params[:status].present?
      students = students.joins(:user).where(users: { status: params[:status] })
    end

    # Filter by enrollment date
    if params[:enrollment_from].present?
      students = students.where("enrollment_date >= ?", params[:enrollment_from])
    end

    if params[:enrollment_to].present?
      students = students.where("enrollment_date <= ?", params[:enrollment_to])
    end

    # Pagination
    page = params[:page] || 1
    per_page = 20
    total_count = students.count
    students = students.offset((page.to_i - 1) * per_page).limit(per_page)

    students_data = students.map do |student|
      {
        id: student.id,
        first_name: student.user&.first_name,
        last_name: student.user&.last_name,
        full_name: student.user&.full_name,
        email: student.user&.email,
        phone: student.user&.phone,
        date_of_birth: student.user&.date_of_birth,
        enrollment_date: student.enrollment_date,
        batches: student.batches.where(teacher: teacher).map { |b| b.name }.join(', '),
        batch_count: student.batches.where(teacher: teacher).count,
        status: student.user&.status,
        guardian_name: student.guardian_name,
        attendance_percentage: student.attendance_percentage,
        payment_status: student.payment_status
      }
    end

    render inertia: 'Teacher/Students/Index', props: {
      students: students_data,
      filters: {
        search: params[:search],
        status: params[:status],
        enrollment_from: params[:enrollment_from],
        enrollment_to: params[:enrollment_to]
      },
      pagination: {
        current_page: page.to_i,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end

  def show
    authorize @student

    student_data = {
      id: @student.id,
      first_name: @student.user&.first_name,
      last_name: @student.user&.last_name,
      full_name: @student.user&.full_name,
      email: @student.user&.email,
      phone: @student.user&.phone,
      date_of_birth: @student.user&.date_of_birth,
      address: @student.user&.address,
      enrollment_date: @student.enrollment_date,
      status: @student.user&.status,
      guardian_name: @student.guardian_name,
      guardian_phone: @student.guardian_phone,
      guardian_email: @student.guardian_email,
      emergency_contact: @student.emergency_contact,
      preferred_class_time: @student.preferred_class_time,
      notes: @student.notes,
      avatar_url: @student.user&.avatar&.attached? ? url_for(@student.user.avatar) : nil,
      batches: @student.batches.includes(:course).map do |batch|
        {
          id: batch.id,
          name: batch.name,
          course_name: batch.course.name,
          schedule: batch.schedule
        }
      end,
      batch_enrollments: @student.batch_enrollments.includes(batch: :course).order(created_at: :desc).map do |enrollment|
        {
          id: enrollment.id,
          batch_name: enrollment.batch.name,
          course_name: enrollment.batch.course.name,
          enrolled_at: enrollment.created_at,
          status: enrollment.status
        }
      end,
      attendance_summary: {
        total_classes: @student.attendances.count,
        present: @student.attendances.where(status: 'present').count,
        absent: @student.attendances.where(status: 'absent').count,
        percentage: @student.attendance_percentage
      },
      recent_attendance: @student.attendances.includes(:class_session).order(created_at: :desc).limit(10).map do |attendance|
        {
          id: attendance.id,
          date: attendance.class_session&.scheduled_at,
          status: attendance.status,
          notes: attendance.notes
        }
      end,
      payment_summary: {
        total_paid: @student.payments.where(status: 'completed').sum(:amount),
        pending: @student.payments.where(status: 'pending').sum(:amount),
        last_payment: @student.payments.order(created_at: :desc).first&.created_at
      },
      recent_payments: @student.payments.order(created_at: :desc).limit(5).map do |payment|
        {
          id: payment.id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          status: payment.status,
          payment_method: payment.payment_method
        }
      end
    }

    render inertia: 'Teacher/Students/Show', props: { student: student_data }
  end

  def new
    authorize Student
    render inertia: 'Teacher/Students/New', props: {
      statuses: User.statuses.keys,
      student: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: nil,
        enrollment_date: Date.today,
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        emergency_contact: '',
        preferred_class_time: '',
        notes: '',
        status: 'active'
      }
    }
  end

  def create
    authorize Student

    ActiveRecord::Base.transaction do
      # Create user first
      user = User.new(user_params)
      user.role = 'student'
      user.password = 'password123' # Default password, should be changed
      user.password_confirmation = 'password123'

      if user.save
        # Create student record
        student = Student.new(student_params)
        student.user = user

        if student.save
          redirect_to teacher_student_path(student), notice: 'Student was successfully created.'
        else
          raise ActiveRecord::Rollback
          render inertia: 'Teacher/Students/New', props: {
            student: student,
            errors: student.errors.full_messages,
            statuses: User.statuses.keys
          }
        end
      else
        render inertia: 'Teacher/Students/New', props: {
          student: user,
          errors: user.errors.full_messages,
          statuses: User.statuses.keys
        }
      end
    end
  rescue => e
    render inertia: 'Teacher/Students/New', props: {
      student: params[:student],
      errors: [e.message],
      statuses: User.statuses.keys
    }
  end

  def edit
    authorize @student
    render inertia: 'Teacher/Students/Edit', props: {
      statuses: User.statuses.keys,
      student: {
        id: @student.id,
        first_name: @student.user&.first_name,
        last_name: @student.user&.last_name,
        email: @student.user&.email,
        phone: @student.user&.phone,
        date_of_birth: @student.user&.date_of_birth,
        enrollment_date: @student.enrollment_date,
        guardian_name: @student.guardian_name,
        guardian_phone: @student.guardian_phone,
        guardian_email: @student.guardian_email,
        emergency_contact: @student.emergency_contact,
        preferred_class_time: @student.preferred_class_time,
        notes: @student.notes,
        status: @student.user&.status
      }
    }
  end

  def update
    authorize @student

    ActiveRecord::Base.transaction do
      if @student.user.update(user_params) && @student.update(student_params)
        redirect_to teacher_student_path(@student), notice: 'Student was successfully updated.'
      else
        errors = @student.errors.full_messages + @student.user.errors.full_messages
        render inertia: 'Teacher/Students/Edit', props: {
          student: @student,
          errors: errors,
          statuses: User.statuses.keys
        }
      end
    end
  end

  def destroy
    authorize @student

    if @student.destroy
      redirect_to teacher_students_path, notice: 'Student was successfully deleted.'
    else
      redirect_to teacher_student_path(@student), alert: 'Failed to delete student.'
    end
  end

  private

  def set_student
    @student = policy_scope(Student).find(params[:id])
  end

  def authenticate_teacher!
    unless current_user&.teacher?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def user_params
    params.require(:student).permit(
      :first_name,
      :last_name,
      :email,
      :phone,
      :date_of_birth,
      :address,
      :status,
      :avatar
    )
  end

  def student_params
    params.require(:student).permit(
      :enrollment_date,
      :guardian_name,
      :guardian_phone,
      :guardian_email,
      :emergency_contact,
      :preferred_class_time,
      :notes
    )
  end
end
