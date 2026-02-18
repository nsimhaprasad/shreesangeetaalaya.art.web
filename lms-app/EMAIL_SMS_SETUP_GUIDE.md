# Email & SMS Integration Guide
## Shree Sangeetha Aalaya LMS

This guide explains how to configure email and SMS notifications for your Learning Management System.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Email Configuration](#email-configuration)
   - [Option 1: Gmail SMTP](#option-1-gmail-smtp-easiest)
   - [Option 2: SendGrid](#option-2-sendgrid-recommended-for-production)
   - [Option 3: Mailgun](#option-3-mailgun)
   - [Option 4: AWS SES](#option-4-aws-ses)
3. [SMS Configuration](#sms-configuration)
   - [Option 1: MSG91 (India)](#option-1-msg91-recommended-for-india)
   - [Option 2: Twilio (International)](#option-2-twilio-international)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

---

## Overview

The LMS has built-in support for:
- **Email Notifications**: Payment confirmations, class reminders, enrollment confirmations, attendance summaries
- **SMS Notifications**: Payment confirmations, class reminders, payment reminders, credit purchase confirmations

Both email and SMS are **disabled by default** and only log to the console. Follow this guide to enable them.

---

## Email Configuration

### Prerequisites

1. Copy `.env.example` to `.env`:
   ```bash
   cd lms-app
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

### Option 1: Gmail SMTP (Easiest)

**Best for**: Development and testing

**Steps**:

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Configure `.env`**:
   ```env
   EMAIL_DELIVERY_ENABLED=true
   EMAIL_PROVIDER=smtp
   EMAIL_FROM_ADDRESS=your-email@gmail.com
   EMAIL_FROM_NAME=Shree Sangeetha Aalaya

   SMTP_ADDRESS=smtp.gmail.com
   SMTP_PORT=587
   SMTP_DOMAIN=gmail.com
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_AUTHENTICATION=plain
   SMTP_ENABLE_STARTTLS_AUTO=true
   ```

4. **Restart the server**:
   ```bash
   bin/dev
   ```

5. **Test**: Create a payment or class session to trigger an email

**Limitations**:
- Gmail limits: 500 emails/day
- Not recommended for production
- May flag your account if too many emails sent

---

### Option 2: SendGrid (Recommended for Production)

**Best for**: Production with high email volume

**Pricing**: Free tier includes 100 emails/day forever

**Steps**:

1. **Sign up for SendGrid**:
   - Go to https://signup.sendgrid.com/
   - Create a free account

2. **Create an API Key**:
   - Dashboard → Settings → API Keys
   - Click "Create API Key"
   - Name it "LMS Production"
   - Select "Full Access"
   - Copy the API key (you'll only see it once!)

3. **Configure `.env`**:
   ```env
   EMAIL_DELIVERY_ENABLED=true
   EMAIL_PROVIDER=sendgrid
   EMAIL_FROM_ADDRESS=noreply@shreesangeetaalaya.art
   EMAIL_FROM_NAME=Shree Sangeetha Aalaya

   SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
   SMTP_DOMAIN=shreesangeetaalaya.art
   ```

4. **Verify your sender domain** (Required for production):
   - Dashboard → Settings → Sender Authentication
   - Authenticate Your Domain
   - Follow DNS setup instructions

5. **Restart the server**

**Limits**:
- Free: 100 emails/day
- Paid plans start at $15/month for 40,000 emails/month

---

### Option 3: Mailgun

**Best for**: Developers, good India support

**Pricing**: Free tier includes 5,000 emails/month for 3 months

**Steps**:

1. **Sign up for Mailgun**:
   - Go to https://signup.mailgun.com/
   - Create account

2. **Get your API credentials**:
   - Dashboard → Sending → Domain Settings
   - Copy your "API Key"
   - Note your sending domain (e.g., `mg.shreesangeetaalaya.art`)

3. **Configure `.env`**:
   ```env
   EMAIL_DELIVERY_ENABLED=true
   EMAIL_PROVIDER=mailgun
   EMAIL_FROM_ADDRESS=noreply@shreesangeetaalaya.art
   EMAIL_FROM_NAME=Shree Sangeetha Aalaya

   MAILGUN_API_KEY=your-mailgun-api-key
   MAILGUN_DOMAIN=mg.shreesangeetaalaya.art
   ```

4. **Set up DNS records** for your domain (required)

5. **Restart the server**

---

### Option 4: AWS SES

**Best for**: Already using AWS, high volume

**Pricing**: $0.10 per 1,000 emails

**Steps**:

1. **Create AWS Account** and enable SES

2. **Verify your domain** in SES console

3. **Create SMTP credentials**:
   - SES Console → SMTP Settings
   - Create SMTP Credentials
   - Download credentials

4. **Configure `.env`**:
   ```env
   EMAIL_DELIVERY_ENABLED=true
   EMAIL_PROVIDER=aws_ses
   EMAIL_FROM_ADDRESS=noreply@shreesangeetaalaya.art
   EMAIL_FROM_NAME=Shree Sangeetha Aalaya

   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

5. **Restart the server**

**Note**: SES starts in "sandbox mode" with limits. Request production access for unlimited sending.

---

## SMS Configuration

### Prerequisites

SMS requires the `httparty` gem (already in Gemfile).

For Twilio, uncomment in `Gemfile`:
```ruby
gem "twilio-ruby"
```

Then run:
```bash
bundle install
```

---

### Option 1: MSG91 (Recommended for India)

**Best for**: India-based users, affordable pricing

**Pricing**:
- Pay-as-you-go: ₹0.10-0.25 per SMS
- Minimum recharge: ₹500 (~2000 SMS)

**Steps**:

1. **Sign up for MSG91**:
   - Go to https://msg91.com/
   - Create account

2. **Get your Auth Key**:
   - Dashboard → Settings → API Keys
   - Copy your "Auth Key"

3. **Get a Sender ID**:
   - Dashboard → Manage → Sender IDs
   - Request a sender ID (e.g., "SHRSNG" or "SANGTA")
   - Wait for approval (1-2 business days)

4. **Configure `.env`**:
   ```env
   SMS_DELIVERY_ENABLED=true
   SMS_PROVIDER=msg91

   MSG91_AUTH_KEY=your-msg91-auth-key
   MSG91_SENDER_ID=SHRSNG
   MSG91_ROUTE=4
   ```

   **Route options**:
   - `1` = Promotional
   - `4` = Transactional (Recommended - no DND restrictions)

5. **Add credits** to your MSG91 account

6. **Restart the server**

**Advantages**:
- India-focused, excellent delivery rates
- No DND issues with transactional route
- Affordable pricing
- Good support

---

### Option 2: Twilio (International)

**Best for**: International SMS, premium features

**Pricing**:
- India: $0.0066 per SMS (~₹0.55)
- US: $0.0079 per SMS
- Free trial: $15 credit

**Steps**:

1. **Sign up for Twilio**:
   - Go to https://www.twilio.com/try-twilio
   - Create account (phone verification required)

2. **Get your credentials**:
   - Dashboard → Account Info
   - Copy "Account SID" and "Auth Token"

3. **Get a phone number**:
   - Dashboard → Phone Numbers → Buy a Number
   - Select a number with SMS capability
   - For India, select an Indian number

4. **Uncomment Twilio gem in `Gemfile`**:
   ```ruby
   gem "twilio-ruby"
   ```

5. **Run bundle install**:
   ```bash
   bundle install
   ```

6. **Configure `.env`**:
   ```env
   SMS_DELIVERY_ENABLED=true
   SMS_PROVIDER=twilio

   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

7. **Restart the server**

**Note**: For production use in India, you need to register your business with Twilio and get a local sender ID.

---

## Testing

### Email Testing

1. **Check logs** when email delivery is disabled:
   ```bash
   tail -f lms-app/log/development.log
   ```
   You should see:
   ```
   ================================================================================
   EMAIL SENT (Stub - Configure email provider for actual delivery)
   To: student@example.com
   Subject: Payment Confirmation
   Body: Dear John, your payment of ₹500 has been received...
   ================================================================================
   ```

2. **Enable email delivery**:
   ```env
   EMAIL_DELIVERY_ENABLED=true
   ```

3. **Trigger a test email**:
   - Login as teacher
   - Record a payment for a student
   - Check the student's email inbox

4. **Check for errors**:
   ```bash
   tail -f lms-app/log/development.log
   ```

### SMS Testing

1. **Check logs** when SMS delivery is disabled (default):
   ```bash
   tail -f lms-app/log/development.log
   ```
   You should see:
   ```
   ================================================================================
   SMS SENT (Stub - Configure SMS provider for actual delivery)
   To: +919876543210
   Message: Dear John, your payment of Rs.500 has been received...
   ================================================================================
   ```

2. **Enable SMS delivery**:
   ```env
   SMS_DELIVERY_ENABLED=true
   SMS_PROVIDER=msg91
   MSG91_AUTH_KEY=your-key-here
   ```

3. **Trigger a test SMS**:
   - Record a payment for a student with a phone number
   - Check the student's phone

4. **Check for delivery**:
   - For MSG91: Dashboard → Reports → SMS Log
   - For Twilio: Dashboard → Messaging → Logs

---

## Troubleshooting

### Email Issues

**Problem**: Emails not sending

**Solutions**:
1. Check `EMAIL_DELIVERY_ENABLED=true` in `.env`
2. Verify SMTP credentials are correct
3. Check logs: `tail -f log/development.log`
4. For Gmail: Ensure App Password is used, not regular password
5. For SendGrid/Mailgun: Verify domain is authenticated
6. Test with a simple email client (Thunderbird, Mail.app) using same settings

**Problem**: Emails going to spam

**Solutions**:
1. Authenticate your sending domain (SPF, DKIM, DMARC)
2. Use a professional email address (not gmail.com)
3. Avoid spam trigger words in templates
4. Warm up your domain (start with low volume)

### SMS Issues

**Problem**: SMS not sending

**Solutions**:
1. Check `SMS_DELIVERY_ENABLED=true` in `.env`
2. Verify API credentials
3. Check phone number format (should include country code)
4. For MSG91: Ensure sender ID is approved
5. Check credits/balance in provider dashboard
6. Check logs for error messages

**Problem**: SMS not delivered

**Solutions**:
1. Verify phone number is correct
2. For India: Use transactional route (4) to bypass DND
3. Check message length (<300 characters)
4. Check provider dashboard for delivery status
5. For Twilio: Ensure number is verified (in trial mode)

---

## Production Deployment

### Checklist

**Email**:
- [ ] Use SendGrid, Mailgun, or AWS SES (not Gmail)
- [ ] Authenticate your sending domain (SPF, DKIM)
- [ ] Set `EMAIL_DELIVERY_ENABLED=true`
- [ ] Use environment variables for all credentials
- [ ] Test email delivery thoroughly
- [ ] Monitor email bounce rates
- [ ] Set up error notifications

**SMS**:
- [ ] Use MSG91 or Twilio
- [ ] Add sufficient credits
- [ ] Use approved sender ID
- [ ] Set `SMS_DELIVERY_ENABLED=true`
- [ ] Test SMS delivery to multiple numbers
- [ ] Monitor delivery rates
- [ ] Set up low-balance alerts

**Security**:
- [ ] Never commit `.env` to git (already in `.gitignore`)
- [ ] Use environment variables in production (Heroku config vars, Railway secrets, etc.)
- [ ] Rotate API keys periodically
- [ ] Enable 2FA on provider accounts
- [ ] Use separate accounts for dev/staging/production

**Monitoring**:
- [ ] Set up log monitoring (Papertrail, Loggly)
- [ ] Monitor email/SMS sending limits
- [ ] Track bounce/failure rates
- [ ] Set up alerts for delivery failures

---

## Environment Variables Reference

### Email

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_DELIVERY_ENABLED` | No | `false` | Enable actual email sending |
| `EMAIL_PROVIDER` | No | `smtp` | Provider: `smtp`, `sendgrid`, `mailgun`, `aws_ses` |
| `EMAIL_FROM_ADDRESS` | Yes | - | Sender email address |
| `EMAIL_FROM_NAME` | No | `Shree Sangeetha Aalaya` | Sender name |
| `SMTP_ADDRESS` | For SMTP | `smtp.gmail.com` | SMTP server address |
| `SMTP_PORT` | For SMTP | `587` | SMTP server port |
| `SMTP_USERNAME` | For SMTP | - | SMTP username |
| `SMTP_PASSWORD` | For SMTP | - | SMTP password |
| `SENDGRID_API_KEY` | For SendGrid | - | SendGrid API key |
| `MAILGUN_API_KEY` | For Mailgun | - | Mailgun API key |
| `MAILGUN_DOMAIN` | For Mailgun | - | Mailgun domain |
| `AWS_ACCESS_KEY_ID` | For AWS SES | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | For AWS SES | - | AWS secret key |
| `AWS_REGION` | For AWS SES | `us-east-1` | AWS region |

### SMS

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMS_DELIVERY_ENABLED` | No | `false` | Enable actual SMS sending |
| `SMS_PROVIDER` | No | `msg91` | Provider: `twilio`, `msg91` |
| `MSG91_AUTH_KEY` | For MSG91 | - | MSG91 authentication key |
| `MSG91_SENDER_ID` | For MSG91 | `SHRSNG` | MSG91 sender ID |
| `MSG91_ROUTE` | For MSG91 | `4` | MSG91 route (4 = transactional) |
| `TWILIO_ACCOUNT_SID` | For Twilio | - | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For Twilio | - | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | For Twilio | - | Twilio phone number |

---

## Quick Start Commands

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
# or
code .env

# Install dependencies
bundle install

# Restart server
bin/dev

# Monitor logs
tail -f log/development.log

# Test email (Rails console)
bin/rails console
> EmailService.send_payment_confirmation(StudentPurchase.last)

# Test SMS (Rails console)
bin/rails console
> SmsService.send_payment_confirmation(StudentPurchase.last)
```

---

## Cost Estimates

### Email (Production)

| Provider | Free Tier | Paid Plans |
|----------|-----------|------------|
| **SendGrid** | 100/day forever | $15/month for 40K |
| **Mailgun** | 5K/month for 3 months | $35/month for 50K |
| **AWS SES** | None | $0.10 per 1,000 |
| **Gmail** | 500/day | Not for production |

**Recommendation**: SendGrid (free tier sufficient for most music schools)

### SMS (Production)

| Provider | Cost per SMS (India) | Minimum |
|----------|---------------------|---------|
| **MSG91** | ₹0.10-0.25 | ₹500 recharge |
| **Twilio** | ₹0.55 | $15 trial credit |

**Recommendation**: MSG91 for India (2-5x cheaper than Twilio)

### Monthly Cost Estimate (100 students)

Assuming:
- 100 students
- 4 classes/month per student = 400 classes
- 1 email + 1 SMS per payment = 100 notifications/month
- 1 email + 1 SMS per class reminder = 400 notifications/month

**Email**: 500 emails/month
- SendGrid free tier: **₹0** ✅

**SMS**: 500 SMS/month
- MSG91 @ ₹0.15/SMS: **₹75/month** ($1)
- Twilio @ ₹0.55/SMS: **₹275/month** ($3.30)

**Total**: **₹75-275/month** for full notification system

---

## Support

For issues:
1. Check logs: `log/development.log`
2. Review this guide thoroughly
3. Check provider documentation:
   - SendGrid: https://docs.sendgrid.com/
   - MSG91: https://docs.msg91.com/
   - Twilio: https://www.twilio.com/docs/
4. Contact your email/SMS provider support

---

**Last Updated**: November 2025
**Version**: 1.0
