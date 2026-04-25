# Ytwins — A Polyglot Study Companion

YT Twins explores the same product vision through two distinct architectural lenses: a client-side TypeScript MVP (VexTube) and a full-stack Ruby evolution (FocusTube). This repository serves as a comparative study in polyglot development, demonstrating how different stacks solve identical problems in persistence, state management, and user experience.

## The Twins: Architectural Comparison

### The Ruby Twin (FocusTube)
The "Server-Side" twin focuses on persistence, synchronization, and algorithmic learning through a robust backend.

- **Backend Architecture**: Built with Ruby and Sinatra, utilizing Rack middleware for session security and CSRF protection.
- **Persistence Layer**: Implements the Sequel ORM with a Turso (libSQL) backend, providing a relational schema for users, timestamped notes, and video metadata.
- **Authentication**: Integrated Google OAuth 2.0 via OmniAuth, enabling secure cross-device synchronization.
- **Learning Logic**: Implements a server-side SM-2 (Spaced Repetition) algorithm. It dynamically calculates E-Factors (Ease Factors), repetition counts, and review intervals (in days) based on user recall quality.
- **Infrastructure**: Deployed as Vercel Serverless Functions using the @vercel/ruby runtime, optimized for low-latency relational queries.

### The TypeScript Twin (VexTube)
The "Client-Side" twin focuses on a local-first, high-performance user experience with rich interactive features.

- **Frontend Architecture**: Built on Next.js 16 (App Router) and React 19, utilizing a component-driven design with Radix UI primitives.
- **State Management**: Stateless architecture with a LocalStorage persistence layer for notes and playlist state management.
- **Note Processing Pipeline**: Utilizes Remark and Rehype for real-time Markdown rendering, including LaTeX support (Katex) and syntax highlighting for technical notes.
- **Performance Optimization**: Implements windowing/virtualization via `react-window` to maintain high frame rates when rendering extensive note timelines.
- **Tooling**: Includes a client-side Pomodoro timer for focus sessions and PDF generation logic via `jspdf` for offline study exports.

---

## Repository Structure

```text
.
├── ruby/               # The Ruby Twin (v2.0)
│   ├── api/            # Vercel Serverless entry points
│   ├── db/             # Relational schema and migrations
│   ├── views/          # Server-side ERB templates
│   └── app.rb          # Sinatra application and SM-2 logic
├── typescript/         # The TypeScript Twin (v1.0)
│   ├── src/            # Next.js App Router and components
│   └── package.json    # React 19 and Tailwind 4 dependencies
├── README.md           # Unified technical documentation
└── vercel.json         # Routing configuration (Active: /ruby)
```

---

## Setup and Installation

### Running the Ruby Twin
1. Navigate to the `/ruby` directory.
2. Install dependencies: `bundle install`
3. Initialize the local database: `bundle exec ruby db/schema.rb`
4. Start the development server: `bundle exec rackup`

### Running the TypeScript Twin
1. Navigate to the `/typescript` directory.
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

---

## Deployment

The repository is configured for a Monorepo deployment on the Vercel platform.

- **Primary Route**: The root `vercel.json` is configured to route traffic to the **Ruby Twin**.
- **History**: This repository preserves the original Git history of the TypeScript project to maintain a complete record of the project's evolution.
