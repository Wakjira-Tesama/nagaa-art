# Nagaa Art — Supabase Backend

## 1. Create / open your Supabase project

1. Go to https://supabase.com/dashboard
2. Create a project (or open an existing one)
3. Copy **Project URL** and **anon public** key from **Project Settings → API**

## 2. Connect this app

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 3. Apply the database migration

In the Supabase Dashboard → **SQL Editor**, paste and run:

`supabase/migrations/20261021120000_nagaa_art_schema.sql`

Or with the CLI (after `npx supabase login` + `npx supabase link`):

```bash
npx supabase db push
```

## 4. Create the admin Auth user

Dashboard → **Authentication → Users → Add user**

- Email: e.g. `admin@nagaa.art`
- Password: choose a strong password
- Use these credentials on `/admin` login

## 5. Vercel

Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Project → Settings → Environment Variables, then redeploy.
