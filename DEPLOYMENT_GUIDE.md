# Shree Sangeetha Aalaya LMS - Deployment Guide

## 🚀 Production Deployment on Render with Neon PostgreSQL

### Prerequisites (All Free Tiers)
1. **Render Account** - https://render.com (Free web service)
2. **Neon Database** - https://neon.tech (Free PostgreSQL)
3. **Brevo Account** - https://www.brevo.com (Free: 300 emails/day)
4. **Cloudinary Account** - https://cloudinary.com (Free: 25GB storage)
5. **Sentry Account** (Optional) - https://sentry.io (Free: error tracking)

---

## Step 1: Setup Neon PostgreSQL

1. Go to https://neon.tech and create a free account
2. Create a new project named `shree-sangeetha-aalaya`
3. Copy the connection string (looks like `postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

---

## Step 2: Setup Brevo Email Service

1. Go to https://www.brevo.com and create a free account
2. Verify your sender email (noreply@shreesangeetaalaya.art or your email)
3. Go to SMTP & API settings
4. Copy your SMTP Login and SMTP Key (or API Key)

---

## Step 3: Setup Cloudinary Storage

1. Go to https://cloudinary.com and create a free account
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret

---

## Step 4: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Go to https://dashboard.render.com
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect `render.yaml` and create:
   - Web service
   - PostgreSQL database (or use Neon connection string)
6. Add environment variables for:
   - `BREVO_API_KEY` - Your Brevo SMTP key
   - `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
   - `CLOUDINARY_API_KEY` - From Cloudinary dashboard
   - `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
   - `SENTRY_DSN` (Optional) - From Sentry project

### Option B: Manual Setup

1. **Create Database:**
   - In Neon, your database is already created
   - Copy the DATABASE_URL

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - Name: `shree-sangeetha-aalaya`
     - Region: Oregon (US West) or Singapore (closest to India)
     - Branch: main
     - Root Directory: `.`
     - Runtime: Docker
     - Instance Type: Free

3. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://... (from Neon)
   RAILS_ENV=production
   SECRET_KEY_BASE=[generate random 64 char string]
   EMAIL_PROVIDER=brevo
   EMAIL_DELIVERY_ENABLED=true
   BREVO_API_KEY=your-brevo-key
   EMAIL_FROM_ADDRESS=noreply@shreesangeetaalaya.art
   EMAIL_FROM_NAME=Shree Sangeetha Aalaya
   STORAGE_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   APP_URL=https://your-app.onrender.com
   APP_HOST=your-app.onrender.com
   ```

---

## Step 5: Post-Deployment

1. **Create Admin User:**
   - Go to Render Shell (or use `rails console`)
   - Run:
   ```ruby
   User.create!(
     email: 'admin@shreesangeetaalaya.art',
     password: 'secure_password_here',
     role: 'admin',
     first_name: 'Admin',
     last_name: 'User',
     status: 'active'
   )
   ```

2. **Seed Initial Data:**
   ```bash
   rails db:seed
   ```

3. **Setup Custom Domain:**
   - In Render, go to Settings → Custom Domains
   - Add `shreesangeetaalaya.art` and `www.shreesangeetaalaya.art`
   - Update DNS records as instructed

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ |
| `SECRET_KEY_BASE` | Rails secret key (64 chars) | ✅ |
| `EMAIL_PROVIDER` | Email provider (brevo) | ✅ |
| `BREVO_API_KEY` | Brevo SMTP/API key | ✅ |
| `EMAIL_FROM_ADDRESS` | Sender email address | ✅ |
| `EMAIL_FROM_NAME` | Sender name | ✅ |
| `STORAGE_PROVIDER` | File storage (cloudinary) | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `APP_URL` | Full application URL | ✅ |
| `APP_HOST` | Application hostname | ✅ |
| `SENTRY_DSN` | Sentry error tracking DSN | ❌ |

---

## Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| Render Web | 750 hours/month | Spins down after inactivity |
| Neon DB | 0.5 GB storage | Auto-suspend after inactivity |
| Brevo | 300 emails/day | Free forever |
| Cloudinary | 25 GB storage | 25 GB bandwidth |
| Sentry | 5,000 errors/month | Free forever |

---

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL includes `?sslmode=require`
- Check Neon dashboard for connection limits

### Email Not Sending
- Verify Brevo sender email is confirmed
- Check BREVO_API_KEY is correct
- Enable EMAIL_DELIVERY_ENABLED=true

### File Upload Issues
- Verify Cloudinary credentials
- Check STORAGE_PROVIDER=cloudinary

### App Not Starting
- Check Render logs for errors
- Ensure all required env vars are set
- Verify SECRET_KEY_BASE is set

---

## Support

- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Brevo Docs: https://developers.brevo.com
- Cloudinary Docs: https://cloudinary.com/documentation
