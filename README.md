# FocusTube — Polyglot Learning Platform

FocusTube is a distraction-free YouTube learning companion designed to convert video content into retained knowledge. This repository showcases the evolution of the project from a client-side prototype to a full-stack, database-driven application.

## 🚀 Project Evolution

### v2.0: FocusTube (Ruby Edition) — `current`
**The Full-Stack Evolution.** Built to provide a permanent, synchronized learning environment with a professional backend.
- **Tech Stack**: Ruby, Sinatra, Sequel ORM, Turso (SQLite/libSQL).
- **Authentication**: Google OAuth 2.0.
- **Persistence**: Relational database for users, videos, notes, and collections.
- **Algorithm**: Server-side SM-2 Spaced Repetition scheduler.
- **Deployment**: Vercel Serverless Ruby.

### v1.0: VexTube (TypeScript Edition) — `legacy`
**The Client-Side MVP.** A fast, local-first tool designed for immediate use without an account.
- **Tech Stack**: Next.js 16, React 19, Tailwind CSS 4, Radix UI.
- **Architecture**: Stateless/Local-only using Browser Storage.
- **Key Features**: PDF/Markdown exports, Pomodoro timer, LaTeX & Syntax Highlighting support.
- **Optimization**: React Virtualized for high-performance note rendering.

---

## 📁 Repository Structure

```text
.
├── ruby/               # v2.0 - Active Full-Stack Implementation
│   ├── api/            # Vercel Serverless Entry points
│   ├── db/             # Schema and Migrations
│   ├── views/          # ERB Templates
│   └── app.rb          # Core Sinatra Logic
├── typescript/         # v1.0 - Local-First TS Implementation
│   ├── src/            # Next.js App Router & Components
│   └── package.json    # Modern TS/React Dependencies
├── README.md           # Root Documentation
└── vercel.json         # Deployment Configuration (Active: Ruby)
```

---

## 🛠 Setup & Installation

### Running the Ruby Version (v2.0)
1. Navigate to `/ruby`
2. Install dependencies: `bundle install`
3. Initialize DB: `bundle exec ruby db/schema.rb`
4. Start server: `bundle exec rackup`

### Running the TypeScript Version (v1.0)
1. Navigate to `/typescript`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

---

## 🌐 Deployment

The repository is currently configured for a **Monorepo Deployment** on Vercel. 

- **Primary Route**: The root `vercel.json` routes all traffic to the **Ruby** implementation in `/ruby`.
- **Database**: Connected to **Turso** for global SQLite persistence.
