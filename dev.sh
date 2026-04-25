#!/bin/bash

# FocusTube Unified Dev Script
# This script starts the Ruby/Sinatra backend and the Next.js frontend.

# Add local gem paths to PATH for Ruby
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$HOME/.local/share/gem/ruby/3.2.0/gems/bundler-4.0.10/exe:$PATH"

# Kill background processes on exit
trap "kill 0" EXIT

echo "🚀 Starting FocusTube Development Environment..."

# Check dependencies
if [ ! -d "fullstack/web/node_modules" ]; then
    echo "📦 node_modules missing. Running npm install..."
    (cd fullstack/web && npm install)
fi

# Start the Backend (Sinatra)
echo "💎 Starting Ruby Backend on port 4567..."
# Use bundle if available, otherwise try to install gems
if command -v bundle >/dev/null 2>&1; then
    cd fullstack/web/backend && bundle exec rackup -p 4567 &
else
    echo "⚠️ bundle command not found. Trying to run without bundle exec..."
    cd fullstack/web/backend && rackup -p 4567 &
fi

# Start the Frontend (Next.js)
echo "⚛️ Starting Next.js Frontend on port 3000..."
cd fullstack/web && npm run dev &

# Wait for all background processes
wait
