# FocusTube

FocusTube is a distraction-free YouTube learning companion built with Ruby and Sinatra. It helps you stay focused while watching educational content and provides a system for capturing and reviewing timestamped notes using Spaced Repetition.

## Features

- **Google OAuth Login**: Quick and secure authentication.
- **Distraction-Free Player**: Watch YouTube videos without comments, recommendations, or sidebars.
- **Timestamped Notes**: Capture insights exactly when they happen and jump back to those moments with one click.
- **Collections**: Organize your learning library by topic (e.g., Ruby, DSA, Fitness).
- **Spaced Repetition (SM-2)**: Never forget what you learn. Notes enter a review queue and are resurfaced based on your recall.

## Tech Stack

- **Backend**: Ruby, Sinatra
- **ORM**: Sequel
- **Database**: Turso (libSQL) / SQLite
- **Frontend**: ERB, Tailwind CSS, Vanilla JS
- **Hosting**: Vercel

## Setup

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Initialize the database:
   ```bash
   bundle exec ruby db/schema.rb
   ```

3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=sqlite://local.db
   SESSION_SECRET=your_secret
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   ```

4. Run locally:
   ```bash
   bundle exec rackup
   ```

## Vercel Deployment

Deploying to Vercel is seamless using the `@vercel/ruby` runtime. Ensure your `vercel.json` is configured to route requests to `api/index.rb`.

```json
{
  "version": 2,
  "functions": {
    "api/index.rb": {
      "runtime": "@vercel/ruby"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.rb"
    }
  ]
}
```
