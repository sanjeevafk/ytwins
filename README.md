# FocusTube (Ytwins) — Learning, Optimized.

FocusTube is a dual-language (Ruby + TypeScript) full-stack application that helps users turn YouTube learning into retained knowledge through distraction-free watching, timestamped notes, and spaced review.

## Why Built?
YouTube is the world's largest classroom, but it's also the world's largest distraction engine. FocusTube was built to provide a dedicated environment for deep learning, stripping away recommendations and comments while adding powerful tools for active recall and spaced repetition.

## The Stack
- **Frontend**: Next.js 15 (App Router) with React 19, Tailwind CSS, and Lucide icons.
- **Backend**: Ruby & Sinatra (modular API) with Sequel ORM.
- **Persistence**: Turso (libSQL) for edge-optimized relational data.
- **Authentication**: Google OAuth 2.0 for secure, seamless login.
- **Deployment**: Vercel (Unified Next.js + Ruby Serverless).

## Key Features
- **Distraction-Free Player**: Watch YouTube without the "up next" noise.
- **Timestamped Note-Taking**: Capture ideas at the exact moment they happen in the video.
- **Spaced Review (SM-2)**: An integrated spaced-repetition algorithm that surfaces notes for review just as you're about to forget them.
- **Collection Management**: Organize your learning resources into logical groups.
- **Cloud Sync**: All your notes and progress are synced across devices.

## Architectural Tradeoffs
- **Sinatra vs Rails**: Chose Sinatra for a lightweight, intentional API surface that doesn't overcomplicate the small feature set.
- **Turso/libSQL**: Opted for Turso to keep the database close to the edge, ensuring snappy responses for global users.
- **HTTP-Only Cookies**: Prioritized security by using server-side session management over JWTs to avoid XSS risks.

## Setup

### Local Development
The easiest way to start both the backend and frontend is to use the unified dev script:
```bash
./dev.sh
```

Alternatively, you can run them separately:

**Backend:**
```bash
cd fullstack/backend
bundle install
bundle exec rackup -p 4567
```

**Frontend:**
```bash
cd fullstack/web
npm install
npm run dev
```

### Docker (Recommended for Production/Testing)
If you have Docker and Docker Compose installed, you can start the entire stack with a single command:

```bash
docker-compose up --build
```

This will:
- Spin up the Ruby API on port `4567`
- Spin up the Next.js Frontend on port `3000`
- Persist your local database in `fullstack/backend/db`

## Repository Structure
- `fullstack/backend`: The Ruby backend logic and database models.
- `fullstack/web`: The Next.js frontend application.
- `ruby/`: (Legacy) Historical server-side templates.
- `typescript/`: (Legacy) Historical local-storage MVP.

---

