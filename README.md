# VexTube

A focused YouTube learning platform designed for distraction-free video consumption and note-taking.

## Overview

VexTube is a web application that enhances the YouTube learning experience by removing distractions and providing tools for effective learning. It supports both individual videos and full playlists, with features for progress tracking and comprehensive note-taking.

## Features

### Core Functionality
- Single video and playlist support via YouTube URLs
- Embedded YouTube player with custom controls
- Progress tracking with completion status
- Playback speed control (0.5x to 2x)
- Cinema mode for distraction-free viewing
- Fullscreen support

### Rich Content Support
- Rich text rendering with Markdown support
- Mathematical formula rendering with KaTeX
- Code syntax highlighting

### Note-Taking
- Per-video note storage
- Markdown support in notes
- Export to PDF and TXT formats
- Note history with search and management
- Auto-save functionality

### User Interface
- Modern dark theme with glassmorphism effects
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Accessible UI components using Radix UI

## Technology Stack

### Framework
- Next.js 16.1.1 with Turbopack
- React 19.2.3
- TypeScript 5.x

### Styling
- Tailwind CSS 4.x
- Radix UI components
- Custom glassmorphism effects

### APIs & Services
- YouTube Data API v3 for video metadata (server-side only)
- LocalStorage for all data persistence

### Key Libraries
- react-youtube for video embedding
- react-markdown for rich text rendering
- rehype-katex for mathematical formulas
- react-syntax-highlighter for code blocks
- jsPDF for PDF export

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# YouTube API (Server-side only - do NOT use NEXT_PUBLIC prefix)
YOUTUBE_API_KEY=your_youtube_api_key
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/                  # Server-side API routes
│   │   └── youtube/          # YouTube API proxy routes
│   ├── page.tsx              # Landing page
│   ├── app/page.tsx          # Main application
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── VideoPlayer.tsx       # Video player with controls
│   ├── NoteTaker.tsx         # Note-taking interface
│   ├── NoteHistory.tsx       # Note management
│   ├── PlaylistSidebar.tsx   # Video list navigation
│   └── ui/                   # Reusable UI components
└── lib/
    ├── youtube.ts            # YouTube client (calls server routes)
    ├── storage.ts            # LocalStorage utilities
    └── types.ts              # TypeScript definitions
```

## API Keys Setup

### YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Restrict the API key to YouTube Data API v3
6. Add the key to `.env.local` as `YOUTUBE_API_KEY` (NOT `NEXT_PUBLIC_`)

> **Important**: The YouTube API key is used server-side only to prevent exposure in client bundles.

## Data Storage

All data is stored locally in the browser (no server storage):
- Video progress and completion status
- Playback settings (speed, dark mode)
- Personal notes with timestamps
- Playlist state and current position

## Browser Compatibility

- Chrome/Edge: Fully supported
- Firefox: Fully supported
- Safari: Fully supported
- Mobile browsers: Responsive design supported

## Performance

- First load optimized with code splitting
- Lazy loading for YouTube player component
- Throttled LocalStorage writes (1000ms)
- Memoized components for efficient re-renders
- Server-side API caching for YouTube data

## Known Limitations

- YouTube API has daily quota limits (10,000 units/day on free tier)
- LocalStorage has size limits (typically 5-10MB)

## Future Roadmap

- Enhanced gamification features
- Advanced note organization
- Social learning features

## License

This is a personal project. All rights reserved.

## Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Video data from YouTube Data API
