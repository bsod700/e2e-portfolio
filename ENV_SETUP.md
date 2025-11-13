# Environment Variables Setup

This project uses environment variables to securely manage Supabase credentials. The environment files are automatically generated from your `.env` file.

## Local Development Setup

1. **Create a `.env` file** in the project root (copy from the example below):

```bash
# Option 1: Provide the full Supabase URL
SUPABASE_URL=https://your-project-id.supabase.co

# Option 2: Provide just the project ID (URL will be constructed automatically)
# SUPABASE_PROJECT_ID=your-project-id

# Supabase Anonymous Key (required)
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (only for server-side operations, never expose in client)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. **The environment files are auto-generated** when you run:
   - `npm start` (runs `prestart` which generates env files)
   - `npm run build` (runs `prebuild` which generates env files)
   - `npm run load-env` (manually generate env files)

## Production Deployment (Vercel)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add the following environment variables:**
   - `SUPABASE_URL` (or `SUPABASE_PROJECT_ID`)
   - `SUPABASE_ANON_KEY`

3. **Redeploy** your application. The build process will automatically:
   - Read environment variables from Vercel
   - Generate `environment.prod.ts` with your production credentials
   - Build the application with the correct configuration

## Security Notes

✅ **DO:**
- Keep your `.env` file in `.gitignore` (already configured)
- Use environment variables in your deployment platform
- The generated environment files are also gitignored

❌ **DON'T:**
- Commit `.env` file to git
- Commit `environment.ts` or `environment.prod.ts` with real credentials
- Expose service role keys in client-side code

## Troubleshooting

If you see errors about missing environment variables:

1. **Check your `.env` file exists** in the project root
2. **Verify variable names** match exactly (case-sensitive)
3. **Run `npm run load-env`** manually to test
4. **For production**, ensure variables are set in Vercel dashboard

## Variable Naming

The script supports multiple naming conventions for flexibility:
- `SUPABASE_URL` or `SUBABASE_URL` (typo support)
- `SUPABASE_PROJECT_ID` or `SUBABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY` or `SUPABASE_ANON` or `SUBABASE_ANON`

