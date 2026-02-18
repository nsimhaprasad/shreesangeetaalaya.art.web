module Sms
  class TwilioClient
    class << self
      # Send SMS using Twilio
      # Requires: twilio-ruby gem (uncomment in Gemfile)
      def send_sms(to:, message:)
        return false unless configured?

        begin
          # Uncomment when twilio-ruby gem is installed:
          # client = Twilio::REST::Client.new(account_sid, auth_token)
          # client.messages.create(
          #   from: from_number,
          #   to: to,
          #   body: message
          # )

          # For now, log that Twilio would be called
          Rails.logger.info "=" * 80
          Rails.logger.info "TWILIO SMS (Ready to send - uncomment Twilio gem)"
          Rails.logger.info "To: #{to}"
          Rails.logger.info "Message: #{message}"
          Rails.logger.info "From: #{from_number}"
          Rails.logger.info "=" * 80

          true
        rescue => e
          Rails.logger.error "Twilio SMS Error: #{e.message}"
          false
        end
      end

      def configured?
        account_sid.present? && auth_token.present? && from_number.present?
      end

      private

      def account_sid
        ENV['TWILIO_ACCOUNT_SID']
      end

      def auth_token
        ENV['TWILIO_AUTH_TOKEN']
      end

      def from_number
        ENV['TWILIO_PHONE_NUMBER']
      end
    end
  end
end
