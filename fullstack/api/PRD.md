# FocusTube — Updated PRD / Design Doc

**Version:** 2.0
**Status:** Finalized MVP Scope
**Date:** April 25, 2026

---

# 1. Product Summary

**FocusTube** is a distraction-free YouTube learning companion.

It removes the noise around YouTube and adds a practical learning system:

* focused video watching
* timestamped note capture
* collections for organization
* spaced repetition review of notes

The product is intentionally narrow, lean, and complete.

This is a portfolio-grade product demonstrating:

* Ruby backend engineering
* relational database design
* OAuth auth flows
* API integrations
* product thinking
* lean UX execution

---

# 2. Product Goals

## Primary Goal

Help users convert YouTube learning into retained knowledge.

## Secondary Goal

Ship a polished full-stack Ruby application with minimal operational complexity.

---

# 3. Non-Goals

Explicitly out of scope:

* AI summaries
* collaboration
* social features
* comments
* mobile apps
* browser extension
* recommendation engine
* analytics dashboards
* chatbots
* notifications
* file uploads
* extra integrations

No scope creep.

---

# 4. Core User Journey

1. User signs in with Google
2. Pastes YouTube URL
3. Video opens in distraction-free player
4. User captures timestamped notes while learning
5. Notes are stored per video
6. Notes enter review queue
7. User returns daily to review due notes

---

# 5. Target User

* students
* self-learners
* developers learning from tutorials
* people who use YouTube as an education platform

---

# 6. Final Feature Set (MVP)

---

## A. Authentication

### User Story

As a user, I want quick login without passwords.

### Features

* Google OAuth login
* persistent session cookie
* logout

### Stored Data

* name
* email
* avatar URL

---

## B. Video Import

### User Story

As a user, I want to paste a YouTube link and start learning instantly.

### Features

* paste YouTube URL
* automatic metadata fetch
* save to library

### Metadata Stored

* YouTube video ID
* title
* thumbnail
* duration
* channel name

---

## C. Distraction-Free Watch Page

### User Story

As a user, I want a clean learning environment.

### Features

* embedded player only
* no comments
* no suggested videos
* dark focused layout
* note sidebar / lower panel

---

## D. Timestamped Notes

### User Story

As a user, I want to capture insights exactly when they occur.

### Features

* capture current playback time
* write note
* save instantly
* click note to seek timestamp
* ordered note list

### Note Fields

* content
* timestamp (seconds)
* created_at

---

## E. Collections

### User Story

As a user, I want to organize videos by topic.

### Features

* create collection
* add/remove videos
* list videos inside collection

Examples:

* DSA
* Ruby
* Fitness
* History

---

## F. Review Queue (Spaced Repetition)

### User Story

As a user, I want my notes resurfaced before I forget them.

### Features

* each note enters review system
* due notes page
* user rates recall 1–5
* next review recalculated

### Algorithm

SM-2 inspired simplified scheduler.

---

# 7. Tech Stack (Final)

| Layer        | Choice                     |
| ------------ | -------------------------- |
| Backend      | Ruby                       |
| Framework    | Sinatra                    |
| ORM          | Sequel                     |
| Templates    | ERB                        |
| Frontend     | HTML + Tailwind + small JS |
| Hosting      | Vercel                     |
| Database     | Turso (libSQL / SQLite)    |
| Auth         | Google OAuth               |
| External API | YouTube Data API           |

---

# 8. Why This Stack

## Ruby

You want to learn Ruby and ship with it.

## Sinatra

Better fit than Rails for Vercel serverless constraints.

## Turso

SQLite simplicity with remote persistence.

## Vercel

Excellent DX and frictionless deploy flow.

---

# 9. System Architecture

```txt id="qf2m4v"
Browser
 ↓
Vercel Ruby Serverless Function
 ↓
Sinatra App
 ↓
Turso (SQLite/libSQL)

External:
- Google OAuth
- YouTube API
```

---

# 10. Database Schema

## users

```txt id="z7c2pa"
id
google_id
name
email
avatar_url
created_at
```

---

## videos

```txt id="1s0e6k"
id
user_id
youtube_id
title
thumbnail_url
duration_seconds
channel_name
created_at
```

---

## notes

```txt id="j1dp9u"
id
user_id
video_id
content
timestamp_seconds
created_at
updated_at
```

---

## collections

```txt id="4u9ry1"
id
user_id
name
created_at
```

---

## collection_videos

```txt id="z0xgde"
id
collection_id
video_id
```

---

## reviews

```txt id="sk7h5n"
id
note_id
user_id
ease_factor
interval_days
repetitions
next_review_at
last_reviewed_at
```

---

# 11. Routes

## Public

| Route            | Method | Purpose        |
| ---------------- | ------ | -------------- |
| `/`              | GET    | Landing page   |
| `/auth/google`   | GET    | Start login    |
| `/auth/callback` | GET    | OAuth callback |

---

## Authenticated

| Route              | Method   | Purpose            |
| ------------------ | -------- | ------------------ |
| `/dashboard`       | GET      | Main library       |
| `/videos/import`   | POST     | Import YouTube URL |
| `/videos/:id`      | GET      | Watch page         |
| `/notes`           | POST     | Create note        |
| `/collections`     | GET/POST | List/Create        |
| `/collections/:id` | GET      | View collection    |
| `/review`          | GET      | Due notes          |
| `/review/:id`      | POST     | Submit rating      |

---

# 12. UI Layout

## Dashboard

* import bar
* recent videos
* collections
* notes due today

## Watch Page

* large player
* capture note button
* note input
* note timeline list

## Review Page

* one note at a time
* recall buttons 1–5
* progress count

---

# 13. Review Logic

## On Note Creation

```txt id="h2r9fd"
interval = 1 day
repetitions = 0
ease = 2.5
next_review = tomorrow
```

## On Good Recall

Increase:

* repetitions
* interval

## On Poor Recall

Reset interval lower.

Keep implementation simple.

---

# 14. Performance Rules

* fetch YouTube metadata once
* cache locally in DB
* avoid unnecessary JS bundles
* server-render pages
* keep requests minimal

---

# 15. Security Rules

* secure cookies
* CSRF protection
* validate URLs
* user-scoped queries only
* sanitize note content

---

# 16. Development Roadmap

## Phase 1

* project scaffold
* auth
* DB connection
* deploy hello world

## Phase 2

* import videos
* dashboard
* watch page

## Phase 3

* notes system
* timestamp seeking

## Phase 4

* collections

## Phase 5

* review queue

## Phase 6

* polish + README + screenshots

---

# 17. Success Criteria

MVP is successful if user can:

* login
* import video
* watch distraction-free
* take timestamp notes
* organize videos
* review notes later

No extra metrics needed.

---

# 18. Risks

| Risk                  | Mitigation           |
| --------------------- | -------------------- |
| Ruby on Vercel quirks | keep Sinatra minimal |
| OAuth config pain     | configure early      |
| YouTube API quota     | store metadata       |
| Serverless latency    | lightweight stack    |
| Scope creep           | freeze features      |

---
