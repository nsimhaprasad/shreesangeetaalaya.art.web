# syntax=docker/dockerfile:1
FROM ruby:3.4.7-slim-bookworm

# Install dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libpq-dev \
    libvips \
    pkg-config \
    git \
    curl \
    nodejs \
    npm && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set working directory
WORKDIR /rails

# Install JavaScript dependencies
COPY lms-app/package.json lms-app/package-lock.json ./
RUN npm install

# Install Ruby gems
COPY lms-app/Gemfile lms-app/Gemfile.lock ./
RUN bundle install

# Copy application code
COPY lms-app/. .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Precompile assets (for production)
# RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# Run and own only the runtime files as a non-root user for security
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER rails:rails

# Entrypoint prepares the database
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
