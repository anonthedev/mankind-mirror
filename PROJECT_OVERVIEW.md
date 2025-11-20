# MankindMirror - Men's Mental Health Platform

A safe and supportive space for men to share their thoughts anonymously, journal their feelings, and track their mental wellbeing.

## Features Implemented

### 🔐 Authentication
- **Google OAuth** sign-in via Supabase Auth
- Automatic user profile creation on signup
- Protected routes for journals
- Public access to feed (no login required)

### 📝 Anonymous Feed
- Public feed displaying all posts
- No likes, comments, or reactions
- Anonymous posting for authenticated users
- Real-time updates

### 📖 Personal Journals
- **Create journals** with title and content
- **Edit and delete** existing journals
- **Sidebar navigation** showing all user's journals
- Earn **10 points** for each journal created
- Private journaling - only visible to the author

### 😊 Mood Tracking
- **Daily mood tracker** with 5 emoji options:
  - 😊 Happy
  - 😐 Neutral
  - 😢 Sad
  - 😡 Angry
  - 😰 Anxious
- **One mood per day** restriction
- **Streak tracking** for consecutive days
- Automatic streak calculation

### 🎯 Gamification
- **Streak counter** (🔥) for consecutive mood tracking days
- **Points system** (⭐) for journal writing
- Display in navbar for motivation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Toast Notifications**: Sonner

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── journals/     # Journal CRUD operations
│   │   ├── mood/         # Mood tracking endpoints
│   │   └── posts/        # Post creation endpoint
│   ├── auth/             # Authentication routes
│   │   ├── callback/     # OAuth callback handler
│   │   └── sign-in/      # Sign-in route
│   ├── journals/         # Journal pages
│   │   ├── [id]/         # Individual journal view/edit
│   │   ├── create/       # Create new journal
│   │   ├── layout.tsx    # Journal layout with sidebar
│   │   └── page.tsx      # Journals list
│   ├── layout.tsx        # Root layout with Navbar
│   └── page.tsx          # Home page (public feed)
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Top navigation bar
│   ├── mood-tracker.tsx  # Mood tracking component
│   ├── create-post-button.tsx
│   ├── create-post-modal.tsx
│   ├── journal-sidebar.tsx
│   ├── journal-form.tsx
│   └── journal-view.tsx
├── types/
│   └── database.types.ts # TypeScript types for DB
├── utils/
│   ├── supabase/         # Supabase client utilities
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client
│   │   └── middleware.ts # Middleware client
│   ├── streak.ts         # Streak calculation logic
│   └── points.ts         # Points management logic
└── middleware.ts         # Next.js middleware for auth
```

## Database Schema

### Tables

1. **journal**
   - `id` (uuid, primary key)
   - `created_at` (timestamp)
   - `user_id` (uuid, foreign key)
   - `title` (text)
   - `content` (text)

2. **mood**
   - `id` (uuid, primary key)
   - `created_at` (timestamp)
   - `mood` (text)
   - `user_id` (uuid, foreign key)

3. **posts**
   - `id` (uuid, primary key)
   - `created_at` (timestamp)
   - `user_id` (uuid, foreign key)
   - `content` (text, required)

4. **user_profile**
   - `created_at` (timestamp)
   - `user_id` (uuid, primary key)
   - `streak` (numeric)
   - `points` (numeric)

### Row Level Security (RLS)

- **posts**: Public read, authenticated write (owner only)
- **journal**: Owner only (full CRUD)
- **mood**: Owner only (read, insert)
- **user_profile**: Owner only (read, update)

### Triggers

- Automatic `user_profile` creation on new user signup
- Initial values: streak = 0, points = 0

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
pnpm install
```

### 2. Supabase Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Google OAuth Setup

In your Supabase dashboard:
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your OAuth credentials
4. Add authorized redirect URL: `http://localhost:3000/auth/callback`

### 4. Database Migration

The database migration with RLS policies and triggers has already been applied via Supabase MCP.

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app.

## Key Features Walkthrough

### For Unauthenticated Users
- View public feed with anonymous posts
- Sign in with Google to access full features

### For Authenticated Users
- **Home (/)**: View public feed of anonymous posts
- **Create Post**: Click "Create Post" in navbar to share thoughts anonymously
- **Mood Tracker**: Click mood emoji in navbar to record daily mood
- **Journals**: Access personal journaling area
  - View all journals in sidebar
  - Create new journal (earn 10 points)
  - Edit/delete existing journals
- **Streaks & Points**: Track progress in navbar
  - 🔥 Streak increases with consecutive daily mood tracking
  - ⭐ Points earned from journal writing

## Business Logic

### Mood Streak Calculation
- Streak starts at 1 when first mood is recorded
- Increases by 1 for each consecutive day with a mood entry
- Resets to 0 if a day is missed
- One mood entry allowed per day

### Points System
- **+10 points** for each journal created
- Points accumulate over time
- Encourages regular journaling

### Privacy & Anonymity
- Posts on feed are completely anonymous
- No user identification on posts
- Journals are completely private
- No social features (likes, comments, follows)

## Development Notes

### Next.js 16 Changes
- `cookies()` is now async
- `params` are now Promise-based
- Updated all server components accordingly

### Code Quality
- ✅ TypeScript strict mode
- ✅ No linter errors
- ✅ Proper error handling
- ✅ Loading states on all async operations
- ✅ Toast notifications for user feedback

## Future Enhancements (Optional)

- [ ] Rich text editor for journals
- [ ] Export journals as PDF
- [ ] Mood analytics and charts
- [ ] Journal templates
- [ ] Search and filter journals
- [ ] Dark/light mode toggle
- [ ] Email reminders for mood tracking
- [ ] Progressive web app (PWA)

## Support

This platform is designed to provide a supportive space for men's mental health. If you or someone you know is in crisis, please reach out to:

- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

---

Built with ❤️ for mental health awareness and support.

