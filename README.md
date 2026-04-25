# FocusTube — Polyglot Learning Platform

FocusTube is a distraction-free YouTube learning companion designed to convert video content into structured, retained knowledge. This repository demonstrates a complete architectural evolution, transitioning from a client-side prototype to a full-stack, database-backed application.

## Project Evolution

### v2.0: FocusTube (Ruby Edition) — Active Implementation
The current version focuses on persistence, synchronization, and algorithmic learning through a robust backend.

- **Backend Architecture**: Built with Ruby and Sinatra, utilizing Rack middleware for session security and CSRF protection.
- **Persistence Layer**: Implements the Sequel ORM with a Turso (libSQL) backend, providing a relational schema for users, timestamped notes, and video metadata.
- **Authentication**: Integrated Google OAuth 2.0 via OmniAuth, enabling secure cross-device synchronization.
- **Learning Logic**: Implements a server-side SM-2 (Spaced Repetition) algorithm. It dynamically calculates E-Factors (Ease Factors), repetition counts, and review intervals (in days) based on user recall quality (1-5 scale).
- **Infrastructure**: Deployed as Vercel Serverless Functions using the @vercel/ruby runtime, optimized for low-latency relational queries.

### v1.0: VexTube (TypeScript Edition) — Legacy Prototype
The original prototype focused on a local-first, high-performance user experience with rich client-side features.

- **Frontend Architecture**: Built on Next.js 16 (App Router) and React 19, utilizing a component-driven design with Radix UI primitives.
- **State Management**: Stateless architecture with a LocalStorage persistence layer for notes and playlist state management.
- **Note Processing Pipeline**: Utilizes Remark and Rehype for real-time Markdown rendering, including LaTeX support (Katex) and syntax highlighting for technical notes.
- **Performance Optimization**: Implements windowing/virtualization via `react-window` to maintain high frame rates when rendering extensive note timelines.
- **Tooling**: Includes a client-side Pomodoro timer for focus sessions and PDF generation logic via `jspdf` for offline study exports.

---

## Repository Structure

```text
.
├── ruby/               # v2.0 - Active Full-Stack Implementation
│   ├── api/            # Vercel Serverless entry points (Rack-compatible)
│   ├── db/             # Relational schema and migrations
│   ├── views/          # Server-side ERB templates
│   └── app.rb          # Sinatra application and SM-2 logic
├── typescript/         # v1.0 - Local-First TS Implementation
│   ├── src/            # Next.js App Router, hooks, and components
│   └── package.json    # React 19 and Tailwind 4 dependencies
├── README.md           # Unified technical documentation
└── vercel.json         # Routing configuration (Active: /ruby)
```

---

## Setup and Installation

### Ruby Implementation (v2.0)
1. Navigate to the `/ruby` directory.
2. Install dependencies: `bundle install`
3. Initialize the local database: `bundle exec ruby db/schema.rb`
4. Start the development server: `bundle exec rackup`

### TypeScript Implementation (v1.0)
1. Navigate to the `/typescript` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---

## Deployment Configuration

The repository is configured for a Monorepo deployment on the Vercel platform.

- **Routing**: The root `vercel.json` acts as a gateway, routing all traffic to the Ruby application logic.
- **Database Connectivity**: External connection to a Turso database cluster for global persistence.
