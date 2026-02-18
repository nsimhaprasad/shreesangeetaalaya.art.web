# Local Development with Docker Dependencies

This guide helps you run the Rails app locally while using Docker only for dependencies (PostgreSQL and Redis).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 
- [Docker Compose](https://docs.docker.com/compose/install/)
- Ruby 3.4.7 (use rbenv, rvm, or asdf)
- Node.js

## Quick Start

### 1. Start Docker Dependencies

```bash
# Start PostgreSQL and Redis in Docker
docker-compose up -d

# Check if services are running
docker-compose ps
```

### 2. Install Ruby Gems (Local)

```bash
# Install bundler if not already installed
gem install bundler

# Install all gems
bundle install
```

### 3. Setup Database

```bash
# Create database and run migrations
rails db:create db:migrate

# Optional: Seed with sample data
rails db:seed
```

### 4. Start Rails Server

```bash
# Start the Rails server locally
rails s

# Or with specific port
rails s -p 3000
```

Visit: **http://localhost:3000**

## Workflow

### Daily Development

```bash
# 1. Start Docker dependencies (if not already running)
docker-compose up -d

# 2. Start Rails server
rails s

# 3. Make code changes - they auto-reload instantly
```

### Stop Everything

```bash
# Stop Rails server (Ctrl+C in terminal)

# Stop Docker dependencies
docker-compose down

# Or stop and remove data (⚠️ deletes database)
docker-compose down -v
```

### View Logs

```bash
# Docker logs
docker-compose logs -f

# Rails logs (in another terminal)
tail -f log/development.log
```

## Common Commands

### Database

```bash
# Open database console
rails dbconsole

# Or with psql
psql -h localhost -U postgres -d lms_development

# Reset database
rails db:drop db:create db:migrate

# Run specific migration
rails db:migrate:up VERSION=20250218000001
```

### Redis

```bash
# Connect to Redis
redis-cli -p 6379

# Check Redis is working
redis-cli ping  # Should return PONG
```

### Troubleshooting

**Port already in use:**
```bash
# Find what's using port 5432
lsof -i :5432

# Or change port in docker-compose.yml and .env
```

**Database connection refused:**
```bash
# Make sure Docker is running
docker-compose ps

# Restart services
docker-compose restart

# Check logs
docker-compose logs db
```

**Bundle install fails:**
```bash
# Update bundler
gem install bundler

# Clean and reinstall
bundle clean --force
bundle install
```

## Services

| Service | Host | Port | Docker Name |
|---------|------|------|-------------|
| **PostgreSQL** | localhost | 5432 | db |
| **Redis** | localhost | 6379 | redis |

## Environment Variables

Key variables in `.env`:

```bash
# Database (connects to Docker)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@localhost:5432/lms_development

# Redis (connects to Docker)
REDIS_URL=redis://localhost:6379/0

# Other settings...
```

## Advantages of This Setup

✅ **Fast development** - No Docker build time when changing code  
✅ **Easy debugging** - Full access to local filesystem and gems  
✅ **IDE integration** - Works with VSCode, RubyMine, etc.  
✅ **Hot reloading** - Changes appear instantly  
✅ **Isolated dependencies** - Database and cache in containers  

## Switching to Full Docker

If you later want to run everything in Docker:

```bash
# Use the full docker-compose file
docker-compose -f docker-compose.full.yml up --build
```

(Create `docker-compose.full.yml` with the app service if needed)

## Support

For issues:
- Check Docker is running: `docker ps`
- Check services are healthy: `docker-compose ps`
- View logs: `docker-compose logs`
- Rails console: `rails c`
