# Docker Development Environment

This guide will help you run the Shree Sangeetha Aalaya LMS locally using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

## Quick Start

### 1. Clone the repository and navigate to project

```bash
git clone <repository-url>
cd shreesangeetaalaya.art.web
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your local configuration (no external services needed for basic setup)
```

### 3. Build and start the containers

```bash
docker-compose up --build
```

This will:
- Build the Rails application image
- Start PostgreSQL database
- Start Redis cache
- Run database migrations
- Start the Rails server on http://localhost:3000

### 4. Create database (first time only)

In a new terminal:

```bash
docker-compose exec app ./bin/rails db:create db:migrate db:seed
```

### 5. Access the application

- **Application**: http://localhost:3000
- **Database**: localhost:5432 (PostgreSQL)
- **Redis**: localhost:6379

## Common Commands

### Start the application

```bash
docker-compose up
```

### Start in detached mode (background)

```bash
docker-compose up -d
```

### Stop the application

```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database data)

```bash
docker-compose down -v
```

### View logs

```bash
docker-compose logs -f
```

### Run Rails console

```bash
docker-compose exec app ./bin/rails console
```

### Run database migrations

```bash
docker-compose exec app ./bin/rails db:migrate
```

### Install new gems

```bash
docker-compose exec app bundle install
```

### Install new npm packages

```bash
docker-compose exec app npm install
```

### Precompile assets (for production)

```bash
docker-compose exec app ./bin/rails assets:precompile
```

## Services

### Main Application (`app`)
- Rails 7.2.3 application
- Runs on port 3000
- Auto-reloads code changes
- Connected to PostgreSQL and Redis

### Database (`db`)
- PostgreSQL 16
- Data persisted in Docker volume
- Accessible on port 5432

### Cache (`redis`)
- Redis 7
- Used for caching and Sidekiq
- Accessible on port 6379

### Background Jobs (`sidekiq`) - Optional
- Run with: `docker-compose --profile sidekiq up`
- Processes background jobs
- Requires Redis

## Environment Variables

Key variables in `.env`:

```bash
# Database (automatically configured in docker-compose)
DATABASE_URL=postgres://postgres:password@db:5432/lms_development

# Redis (automatically configured in docker-compose)
REDIS_URL=redis://redis:6379/0

# For external integrations (optional for local dev)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ZOOM_ACCOUNT_ID=
ZOOM_API_KEY=
ZOOM_API_SECRET=
PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
```

## Troubleshooting

### Port already in use

If port 3000 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Database connection issues

Reset the database:

```bash
docker-compose down -v
docker-compose up --build
docker-compose exec app ./bin/rails db:create db:migrate
```

### Bundle install fails

Rebuild the image:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### File permission issues

If you encounter permission errors:

```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Or change the USER in Dockerfile to match your host user ID
```

## Development Workflow

1. **Make code changes**: Files are synced between host and container
2. **Install gems**: Run `docker-compose exec app bundle install`
3. **Run migrations**: Run `docker-compose exec app ./bin/rails db:migrate`
4. **Test changes**: Refresh browser at http://localhost:3000
5. **View logs**: Run `docker-compose logs -f app`

## Production Deployment

For production deployment:

1. Use `Dockerfile` with asset precompilation uncommented
2. Set proper `SECRET_KEY_BASE` and `RAILS_ENV=production`
3. Use external PostgreSQL and Redis services
4. Configure proper logging
5. Set up SSL/TLS

See `render.yaml` for deployment configuration.

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Rails console: `docker-compose exec app ./bin/rails console`
- Database console: `docker-compose exec db psql -U postgres lms_development`
