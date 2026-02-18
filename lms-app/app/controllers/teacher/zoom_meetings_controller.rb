class Teacher::ZoomMeetingsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_teacher!
  before_action :set_class_session

  # POST /teacher/class_sessions/:class_session_id/zoom_meetings
  def create
    authorize @class_session, :update?
    
    zoom_service = ZoomService.new
    
    meeting = zoom_service.create_meeting(
      topic: "#{@class_session.batch.course.name} - #{@class_session.topic}",
      start_time: @class_session.scheduled_at,
      duration: @class_session.duration || 60,
      password: generate_meeting_password,
      settings: {
        host_video: true,
        participant_video: false,
        join_before_host: false,
        waiting_room: true
      }
    )

    if meeting
      @class_session.update!(
        zoom_meeting_id: meeting['id'],
        zoom_join_url: meeting['join_url'],
        zoom_start_url: meeting['start_url'],
        zoom_password: meeting['password'],
        is_online: true
      )

      # Notify students
      notify_students_about_zoom

      redirect_to teacher_class_session_path(@class_session), 
                  notice: 'Zoom meeting created successfully!'
    else
      redirect_to teacher_class_session_path(@class_session), 
                  alert: 'Failed to create Zoom meeting. Please try again.'
    end
  end

  # DELETE /teacher/class_sessions/:class_session_id/zoom_meetings
  def destroy
    authorize @class_session, :update?
    
    if @class_session.zoom_meeting_id.present?
      zoom_service = ZoomService.new
      zoom_service.delete_meeting(@class_session.zoom_meeting_id)
      
      @class_session.update!(
        zoom_meeting_id: nil,
        zoom_join_url: nil,
        zoom_start_url: nil,
        zoom_password: nil,
        is_online: false
      )
      
      redirect_to teacher_class_session_path(@class_session), 
                  notice: 'Zoom meeting deleted successfully!'
    else
      redirect_to teacher_class_session_path(@class_session), 
                  alert: 'No Zoom meeting found for this session.'
    end
  end

  private

  def set_class_session
    @class_session = ClassSession.find(params[:class_session_id])
  end

  def ensure_teacher!
    redirect_to root_path, alert: 'Unauthorized' unless current_user.teacher?
  end

  def generate_meeting_password
    SecureRandom.random_number(1000000).to_s.rjust(6, '0')
  end

  def notify_students_about_zoom
    # This will be implemented with your notification system
    # For now, students will see the Zoom link in their dashboard
    Rails.logger.info "Zoom meeting created for session #{@class_session.id}"
  end
end
