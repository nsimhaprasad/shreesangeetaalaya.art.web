require 'httparty'
require 'json'

class ZoomService
  include HTTParty
  base_uri 'https://api.zoom.us/v2'

  def initialize
    @api_key = ENV['ZOOM_API_KEY']
    @api_secret = ENV['ZOOM_API_SECRET']
    @account_id = ENV['ZOOM_ACCOUNT_ID']
  end

  # Get OAuth access token (Server-to-Server OAuth)
  def access_token
    return @access_token if @access_token && @token_expires_at && Time.now < @token_expires_at

    auth_string = Base64.strict_encode64("#{@api_key}:#{@api_secret}")
    
    response = self.class.post(
      'https://zoom.us/oauth/token',
      headers: {
        'Authorization' => "Basic #{auth_string}",
        'Content-Type' => 'application/x-www-form-urlencoded'
      },
      body: {
        'grant_type' => 'account_credentials',
        'account_id' => @account_id
      }
    )

    if response.success?
      data = JSON.parse(response.body)
      @access_token = data['access_token']
      @token_expires_at = Time.now + data['expires_in'].to_i.seconds
      @access_token
    else
      Rails.logger.error "Zoom OAuth failed: #{response.body}"
      nil
    end
  end

  # Create a meeting
  def create_meeting(topic:, start_time:, duration: 60, password: nil, settings: {})
    return nil unless access_token

    user_id = 'me' # or specific user email
    
    body = {
      topic: topic,
      type: 2, # Scheduled meeting
      start_time: start_time.iso8601,
      duration: duration,
      timezone: 'Asia/Kolkata',
      password: password || generate_password,
      settings: default_meeting_settings.merge(settings)
    }

    response = self.class.post(
      "/users/#{user_id}/meetings",
      headers: {
        'Authorization' => "Bearer #{access_token}",
        'Content-Type' => 'application/json'
      },
      body: body.to_json
    )

    if response.success?
      JSON.parse(response.body)
    else
      Rails.logger.error "Zoom create meeting failed: #{response.body}"
      nil
    end
  end

  # Update a meeting
  def update_meeting(meeting_id:, **params)
    return nil unless access_token

    response = self.class.patch(
      "/meetings/#{meeting_id}",
      headers: {
        'Authorization' => "Bearer #{access_token}",
        'Content-Type' => 'application/json'
      },
      body: params.to_json
    )

    response.success?
  end

  # Delete a meeting
  def delete_meeting(meeting_id)
    return nil unless access_token

    response = self.class.delete(
      "/meetings/#{meeting_id}",
      headers: {
        'Authorization' => "Bearer #{access_token}"
      }
    )

    response.success?
  end

  # Get meeting details
  def get_meeting(meeting_id)
    return nil unless access_token

    response = self.class.get(
      "/meetings/#{meeting_id}",
      headers: {
        'Authorization' => "Bearer #{access_token}"
      }
    )

    if response.success?
      JSON.parse(response.body)
    else
      nil
    end
  end

  private

  def default_meeting_settings
    {
      host_video: true,
      participant_video: false,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      use_pmi: false,
      approval_type: 2, # No registration required
      audio: 'both', # Both telephony and VoIP
      auto_recording: 'none', # Free plan doesn't support cloud recording
      waiting_room: true, # Security feature
      meeting_authentication: false
    }
  end

  def generate_password
    # Generate a random 6-digit numeric password
    SecureRandom.random_number(1000000).to_s.rjust(6, '0')
  end
end
