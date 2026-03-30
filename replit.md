# VidyaShala Workspace

## Overview

VidyaShala is India's AI-powered multilingual learning platform — combining YouTube-style creator uploads, vertical shorts learning feed, AI tutor, sector-based knowledge hubs, quizzes, flashcards, and creator monetization. Built as a production-ready React + Vite + Express fullstack app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/vidyashala), Tailwind CSS, shadcn/ui, Framer Motion, Wouter
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (server), Vite (frontend)

## Structure

```text
workspace/
├── artifacts/
│   ├── api-server/         # Express 5 API server
│   └── vidyashala/         # React + Vite frontend (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

Tables in PostgreSQL:
- `sectors` — Knowledge sectors (Technology, Agriculture, Healthcare, Finance, etc.)
- `creators` — Creator channels with followers, earnings, verification status
- `videos` — Long-form lesson videos with sector, language, quiz/notes flags
- `shorts` — Short-form reels for vertical feed
- `quizzes` — Quiz questions with MCQ options and explanations
- `community_posts` — Community discussion posts
- `comments` — Comments on community posts
- `users` — Learner profiles with XP, streaks, badges
- `watch_history` — Video watch progress tracking
- `saved_videos` — User's saved video bookmarks
- `leaderboard` — Quiz leaderboard entries

## API Routes

All under `/api/`:
- `GET/POST /videos` — list/create videos
- `GET /videos/trending` — trending lessons
- `GET /videos/recommended` — recommended videos
- `GET /videos/:id` — video detail
- `POST /videos/:id/like` — like a video
- `GET/POST /shorts` — shorts feed
- `GET/POST /creators` — creator directory
- `GET /creators/spotlight` — featured creators
- `GET /creators/:id/analytics` — analytics dashboard
- `GET /sectors`, `GET /sectors/:slug` — sector hubs
- `GET/POST /quizzes`, `POST /quizzes/:id/submit` — quizzes
- `GET /leaderboard` — quiz rankings
- `GET/PATCH /users/profile` — user profile
- `GET /users/dashboard` — learning dashboard
- `GET /users/history`, `/users/saved` — history & saved
- `GET/POST /community/posts` — community discussions
- `GET/POST /community/posts/:id/comments` — comments
- `POST /ai/ask` — AI tutor Q&A
- `POST /ai/generate-quiz` — AI quiz generation
- `POST /ai/flashcards` — AI flashcard generation
- `POST /ai/study-plan` — AI study plan
- `GET /home/feed` — home page feed
- `GET /platform/stats` — platform statistics

## Frontend Pages (React + Wouter)

- `/` — Home feed with trending, recommended, shorts strip, creator spotlight
- `/watch/:id` — Video watch page with player, notes, quiz CTA
- `/shorts` — Full-screen vertical shorts/reels feed
- `/explore` — Explore all knowledge sectors
- `/sector/:slug` — Sector hub with roadmap, creators, quizzes
- `/quiz/:id` — Interactive MCQ quiz with timer and scoring
- `/quiz/leaderboard` — Quiz leaderboard with podium
- `/community` — Discussion forums by sector
- `/ai-chat` — AI tutor chat interface
- `/creators` — Creator directory
- `/channel/:id` — Creator channel profile
- `/studio` — Creator upload studio
- `/dashboard` — Learner learning dashboard
- `/profile` — User profile settings
- `/login` — Login page
- `/register` — Registration page

## Design System

- Primary: Saffron orange (#FF6B35)
- Secondary: Deep blue (#1E40AF)
- Accent: Emerald green (#059669)
- Typography: Plus Jakarta Sans + Playfair Display
- Mobile-first responsive design with sticky bottom nav
- Floating AI assistant button (glowing, pulsing)
- Smooth Framer Motion animations throughout
