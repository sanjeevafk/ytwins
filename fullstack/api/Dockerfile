# Syntax: docker/dockerfile:1

# Ruby Backend
FROM ruby:3.2-slim AS api

# Install build dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev sqlite3 libsqlite3-dev curl

WORKDIR /app

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application
COPY . .

# Environment variables
ENV RACK_ENV=production
ENV PORT=4567

EXPOSE 4567

CMD ["bundle", "exec", "rackup", "-o", "0.0.0.0", "-p", "4567"]
