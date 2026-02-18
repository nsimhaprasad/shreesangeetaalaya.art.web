class Student::ProfileController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_student
    before_action :set_student

    def show
      # Get enrollments
      enrollments = @student.batch_enrollments.includes(batch: :course).map do |enrollment|
        {
          id: enrollment.id,
          course_id: enrollment.batch.course.id,
          course_name: enrollment.batch.course.name,
          batch_name: enrollment.batch.name,
          status: enrollment.status,
          enrollment_date: enrollment.created_at
        }
      end

      # Calculate attendance stats
      total_classes = @student.attendances.count
      present_count = @student.attendances.where(status: 'present').count
      attendance_percentage = total_classes > 0 ? (present_count.to_f / total_classes * 100).round(2) : 0

      # Calculate payment stats
      outstanding_dues = @student.pending_payments

      # Build student data
      student_data = {
        id: @student.id,
        name: @student.name,
        email: @student.email,
        phone: @student.phone,
        date_of_birth: @student.date_of_birth,
        gender: @student.user&.gender,
        address: @student.address,
        city: @student.user&.city,
        state: @student.user&.state,
        postal_code: @student.user&.postal_code,
        country: @student.user&.country,
        guardian_name: @student.guardian_name,
        guardian_phone: @student.guardian_phone,
        guardian_email: @student.guardian_email,
        guardian_relationship: @student.guardian_relationship,
        emergency_contact: @student.emergency_contact,
        medical_conditions: @student.medical_conditions,
        notes: @student.notes,
        status: @student.user&.status || 'active',
        created_at: @student.created_at,
        updated_at: @student.updated_at
      }

      render inertia: 'Student/Profile/Show', props: {
        student: student_data,
        enrollments: enrollments,
        attendance_stats: {
          total_classes: total_classes,
          percentage: attendance_percentage
        },
        payment_stats: {
          outstanding: outstanding_dues
        }
      }
    end

    def edit
      student_data = {
        id: @student.id,
        name: @student.name,
        email: @student.email,
        phone: @student.phone,
        date_of_birth: @student.date_of_birth,
        gender: @student.user&.gender,
        address: @student.address,
        city: @student.user&.city,
        state: @student.user&.state,
        postal_code: @student.user&.postal_code,
        country: @student.user&.country || 'India',
        guardian_name: @student.guardian_name,
        guardian_phone: @student.guardian_phone,
        guardian_email: @student.guardian_email,
        guardian_relationship: @student.guardian_relationship,
        emergency_contact: @student.emergency_contact,
        medical_conditions: @student.medical_conditions,
        notes: @student.notes
      }

      render inertia: 'Student/Profile/Edit', props: {
        student: student_data
      }
    end

    def update
      user_params = profile_params.extract!(:name, :email, :phone, :date_of_birth, :gender, :city, :state, :postal_code, :country, :address)
      student_params = profile_params

      begin
        ActiveRecord::Base.transaction do
          # Update user information
          if user_params.present?
            # Split name into first and last name if provided
            if user_params[:name].present?
              name_parts = user_params[:name].split(' ', 2)
              @student.user.update!(
                first_name: name_parts[0],
                last_name: name_parts[1] || '',
                email: user_params[:email],
                phone: user_params[:phone],
                date_of_birth: user_params[:date_of_birth],
                gender: user_params[:gender],
                address: user_params[:address],
                city: user_params[:city],
                state: user_params[:state],
                postal_code: user_params[:postal_code],
                country: user_params[:country]
              )
            end
          end

          # Update student information
          @student.update!(
            guardian_name: student_params[:guardian_name],
            guardian_phone: student_params[:guardian_phone],
            guardian_email: student_params[:guardian_email],
            guardian_relationship: student_params[:guardian_relationship],
            emergency_contact: student_params[:emergency_contact],
            medical_conditions: student_params[:medical_conditions],
            notes: student_params[:notes]
          )
        end

        redirect_to student_profile_path, notice: 'Profile updated successfully.'
      rescue ActiveRecord::RecordInvalid => e
        redirect_to edit_student_profile_path, alert: "Failed to update profile: #{e.message}"
      end
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

    def profile_params
      params.require(:student).permit(
        :name, :email, :phone, :date_of_birth, :gender, :address,
        :city, :state, :postal_code, :country,
        :guardian_name, :guardian_phone, :guardian_email, :guardian_relationship,
        :emergency_contact, :medical_conditions, :notes
      )
    end
end
