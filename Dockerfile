# syntax=docker/dockerfile:1.7

ARG RUBY_VERSION=3.4.7
ARG NODE_VERSION=22-bookworm-slim
ARG BUNDLER_VERSION=2.7.2

FROM node:${NODE_VERSION} AS node

FROM ruby:${RUBY_VERSION}-slim-bookworm AS base

ARG BUNDLER_VERSION

WORKDIR /rails

RUN gem install --no-document bundler -v ${BUNDLER_VERSION}

ENV RAILS_ENV=production \
    RACK_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

FROM base AS build

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx && \
    npm install --global yarn@1.22.22

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      git \
      libpq-dev \
      libyaml-dev \
      libvips \
      pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle config set without "development test" && \
    bundle config set deployment "true" && \
    bundle install && \
    bundle exec bootsnap precompile --gemfile

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN bundle exec bootsnap precompile app/ lib/ && \
    SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile && \
    rm -rf node_modules tmp/cache log/*

FROM base AS runtime

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
      libpq5 \
      libyaml-0-2 \
      libvips && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

RUN useradd --system --create-home --home /home/rails --shell /usr/sbin/nologin rails && \
    mkdir -p /rails/tmp/pids && \
    chown -R rails:rails /rails/db /rails/log /rails/storage /rails/tmp

USER rails:rails

ENTRYPOINT ["/rails/bin/docker-entrypoint"]

EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
