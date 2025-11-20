# Setup Guide for MankindMirror

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

### 2. Google OAuth Setup

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Google** provider
3. Follow Supabase's instructions to set up Google OAuth credentials
4. Add callback URL: `http://localhost:3000/auth/callback` (for local dev)
5. For production, add: `https://yourdomain.com/auth/callback`

### 3. Database Setup

✅ The database migration with RLS policies and triggers has already been applied.

If you need to verify or reapply:
- The trigger `handle_new_user()` creates user profiles automatically
- RLS policies are enabled on all tables
- Check the migration status in Supabase Dashboard → Database → Migrations

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Test Flow

1. **Visit Homepage** - Should see empty or populated feed (public access)
2. **Sign In** - Click "Sign In with Google" button
3. **After Login** - Redirected to `/journals`
4. **Track Mood** - Click mood emoji in navbar, select a mood
5. **Create Post** - Click "Create Post", write anonymous post
6. **Create Journal** - Click "Create Journal" in sidebar, write entry
7. **Verify Points** - Should see +10 points after journal creation
8. **Check Streak** - Mood streak should update after recording mood

### What to Check

- ✅ Google OAuth login works
- ✅ User profile created automatically
- ✅ Feed shows posts (anonymous)
- ✅ Mood tracker works (one per day)
- ✅ Streak increases correctly
- ✅ Journals are private
- ✅ Points awarded for journals
- ✅ Edit and delete journals work

## Troubleshooting

### OAuth Error
- Check Google OAuth credentials in Supabase
- Verify callback URL is correct
- Clear browser cookies and try again

### RLS Error (403)
- Check RLS policies are enabled
- Verify user is authenticated
- Check user_id matches in database

### Streak Not Updating
- Check mood table has entries
- Verify user_profile exists
- Check streak calculation logic in `/src/utils/streak.ts`

### Points Not Adding
- Check journal creation successful
- Verify user_profile table updates
- Check `/api/journals` endpoint response

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update Google OAuth callback URL with production domain
5. Deploy

### Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel
- [ ] Google OAuth callback updated
- [ ] RLS policies verified
- [ ] Database migration applied

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Need Help?

Check the `PROJECT_OVERVIEW.md` for detailed feature documentation.

