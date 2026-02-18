require 'httparty'
require 'json'
require 'base64'
require 'openssl'

class PhonepeService
  include HTTParty
  
  def initialize
    @merchant_id = ENV['PHONEPE_MERCHANT_ID']
    @salt_key = ENV['PHONEPE_SALT_KEY']
    @salt_index = ENV['PHONEPE_SALT_INDEX'] || '1'
    @env = ENV['PHONEPE_ENV'] || 'sandbox' # 'sandbox' or 'production'
    @base_url = @env == 'production' ? 'https://api.phonepe.com/apis/hermes' : 'https://api-preprod.phonepe.com/apis/hermes'
  end

  # Initiate UPI payment
  def initiate_payment(amount:, transaction_id:, user_id:, mobile_number:, callback_url:, redirect_url:, description:)
    payload = {
      merchantId: @merchant_id,
      merchantTransactionId: transaction_id,
      merchantUserId: user_id,
      amount: (amount * 100).to_i, # Convert to paise
      redirectUrl: redirect_url,
      redirectMode: 'POST',
      callbackUrl: callback_url,
      mobileNumber: mobile_number,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    }

    # Add device context if available
    payload[:deviceContext] = {
      deviceOS: 'WEB'
    }

    encoded_payload = Base64.strict_encode64(payload.to_json)
    
    # Generate checksum
    string = encoded_payload + "/pg/v1/pay" + @salt_key
    sha256 = Digest::SHA256.hexdigest(string)
    checksum = sha256 + "###" + @salt_index

    response = HTTParty.post(
      "#{@base_url}/pg/v1/pay",
      headers: {
        'Content-Type' => 'application/json',
        'X-VERIFY' => checksum
      },
      body: {
        request: encoded_payload
      }.to_json
    )

    if response.success?
      data = JSON.parse(response.body)
      if data['success']
        {
          success: true,
          payment_url: data.dig('data', 'instrumentResponse', 'redirectInfo', 'url'),
          transaction_id: transaction_id
        }
      else
        { success: false, error: data['message'] }
      end
    else
      Rails.logger.error "PhonePe payment initiation failed: #{response.body}"
      { success: false, error: 'Payment initiation failed' }
    end
  end

  # Check transaction status
  def check_status(transaction_id)
    endpoint = "/pg/v1/status/#{@merchant_id}/#{transaction_id}"
    
    # Generate checksum
    string = endpoint + @salt_key
    sha256 = Digest::SHA256.hexdigest(string)
    checksum = sha256 + "###" + @salt_index

    response = HTTParty.get(
      "#{@base_url}#{endpoint}",
      headers: {
        'Content-Type' => 'application/json',
        'X-VERIFY' => checksum,
        'X-MERCHANT-ID' => @merchant_id
      }
    )

    if response.success?
      data = JSON.parse(response.body)
      if data['success']
        {
          success: true,
          status: data.dig('data', 'state'), # PENDING, COMPLETED, FAILED
          amount: data.dig('data', 'amount').to_f / 100,
          payment_mode: data.dig('data', 'paymentInstrument', 'type'),
          transaction_id: transaction_id
        }
      else
        { success: false, error: data['message'] }
      end
    else
      Rails.logger.error "PhonePe status check failed: #{response.body}"
      { success: false, error: 'Status check failed' }
    end
  end

  # Refund transaction
  def refund(transaction_id:, refund_id:, amount:, callback_url:)
    payload = {
      merchantId: @merchant_id,
      merchantTransactionId: refund_id,
      originalTransactionId: transaction_id,
      amount: (amount * 100).to_i,
      callbackUrl: callback_url
    }

    encoded_payload = Base64.strict_encode64(payload.to_json)
    
    # Generate checksum
    string = encoded_payload + "/pg/v1/refund" + @salt_key
    sha256 = Digest::SHA256.hexdigest(string)
    checksum = sha256 + "###" + @salt_index

    response = HTTParty.post(
      "#{@base_url}/pg/v1/refund",
      headers: {
        'Content-Type' => 'application/json',
        'X-VERIFY' => checksum
      },
      body: {
        request: encoded_payload
      }.to_json
    )

    if response.success?
      data = JSON.parse(response.body)
      { success: data['success'], data: data['data'] }
    else
      Rails.logger.error "PhonePe refund failed: #{response.body}"
      { success: false, error: 'Refund failed' }
    end
  end

  # Verify webhook callback
  def verify_webhook(payload:, checksum_header:)
    # Extract salt index from checksum header
    parts = checksum_header.split('###')
    return false if parts.length != 2
    
    received_checksum = parts[0]
    salt_index = parts[1]
    
    # Generate expected checksum
    string = payload + "/pg/v1/pay" + @salt_key
    expected_checksum = Digest::SHA256.hexdigest(string)
    
    ActiveSupport::SecurityUtils.secure_compare(received_checksum, expected_checksum)
  end
end
