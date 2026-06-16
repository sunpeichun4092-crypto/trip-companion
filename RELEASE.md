# TripMate Release Package

This package is the deployable project source, not the static demo.

## What to deploy

- Web app: `apps/web` (Next.js)
- API server: `server` (Express)
- Shared package: `packages/shared`
- Database migrations: `supabase/migrations`
- Mobile app source: `apps/mobile` (Expo)

The `docs` demo is intentionally excluded from the release zip.

## Required services

1. Create a Supabase project.
2. Run migrations from `supabase/migrations`.
3. Create storage buckets according to `supabase/migrations/0003_storage.sql`.
4. Add OpenAI and search provider keys if AI discovery/travelogue features should be live.

## Web environment

Set these in Vercel, Netlify, or your server environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
OPENAI_MODEL_TEXT=gpt-4o-mini
OPENAI_MODEL_VISION=gpt-4o
SERPAPI_API_KEY=
BING_SEARCH_KEY=
```

## Server environment

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
OPENAI_MODEL_TEXT=gpt-4o
OPENAI_MODEL_VISION=gpt-4o
SERPAPI_KEY=
BING_SEARCH_KEY=
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=https://your-web-domain.com
```

## Build checks

```bash
npm install
npm run build:shared
npm run build:web
npm --workspace server run build
```

For local build checks without real Supabase keys, placeholder values can be used. Production deployment must use real keys.

