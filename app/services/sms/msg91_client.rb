module Sms
  class Msg91Client
    class << self
      # Send SMS using MSG91 (India)
      # Uses HTTParty gem for REST API calls
      def send_sms(to:, message:)
        return false unless configured?

        begin
          # Clean phone number (remove +91 if present)
          clean_number = to.gsub(/^\+?91/, '')

          response = HTTParty.post(
            'https://api.msg91.com/api/v5/flow/',
            headers: {
              'authkey' => auth_key,
              'Content-Type' => 'application/json'
            },
            body: {
              sender: sender_id,
              route: route,
              country: '91',
              sms: [
                {
                  message: message,
                  to: [clean_number]
                }
              ]
            }.to_json
          )

          if response.success?
            Rails.logger.info "=" * 80
            Rails.logger.info "MSG91 SMS SENT SUCCESSFULLY"
            Rails.logger.info "To: #{to}"
            Rails.logger.info "Message: #{message}"
            Rails.logger.info "Response: #{response.body}"
            Rails.logger.info "=" * 80
            true
          else
            Rails.logger.error "MSG91 SMS Error: #{response.code} - #{response.body}"
            false
          end
        rescue => e
          Rails.logger.error "MSG91 SMS Exception: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          false
        end
      end

      # Alternative: Send using MSG91's simpler API (for testing)
      def send_sms_simple(to:, message:)
        return false unless configured?

        begin
          clean_number = to.gsub(/^\+?91/, '')

          url = "https://api.msg91.com/api/sendhttp.php"
          params = {
            authkey: auth_key,
            mobiles: clean_number,
            message: message,
            sender: sender_id,
            route: route,
            country: '91'
          }

          response = HTTParty.get(url, query: params)

          Rails.logger.info "=" * 80
          Rails.logger.info "MSG91 SMS (Simple API)"
          Rails.logger.info "To: #{to}"
          Rails.logger.info "Response: #{response.body}"
          Rails.logger.info "=" * 80

          response.success?
        rescue => e
          Rails.logger.error "MSG91 SMS Simple Error: #{e.message}"
          false
        end
      end

      def configured?
        auth_key.present? && sender_id.present?
      end

      private

      def auth_key
        ENV['MSG91_AUTH_KEY']
      end

      def sender_id
        ENV.fetch('MSG91_SENDER_ID', 'SHRSNG')
      end

      def route
        ENV.fetch('MSG91_ROUTE', '4') # Route 4 = Transactional
      end
    end
  end
end
