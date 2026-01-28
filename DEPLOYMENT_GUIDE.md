# Deployment Guide - Pastebin-Lite on Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a database using one of:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech) (Recommended - Free tier available)
   - [Supabase](https://supabase.com)
   - Any PostgreSQL provider

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Pastebin-Lite application"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Set Environment Variables

In the Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://user:password@host:port/database
TEST_MODE=0
```

**Important**: 
- For production, set `TEST_MODE=0`
- For testing with automated tests, set `TEST_MODE=1`

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# First deployment (will ask configuration questions)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? pastebin-lite (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? No

# Production deployment
vercel --prod
```

### Step 4: Set Environment Variables

```bash
# Set DATABASE_URL
vercel env add DATABASE_URL

# When prompted, paste your PostgreSQL connection string
# Select: Production, Preview, Development (all environments)

# Set TEST_MODE
vercel env add TEST_MODE

# Enter: 0 (for production)
# Select: Production, Preview, Development
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Setting Up PostgreSQL Database

### Option A: Vercel Postgres (Easiest)

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Follow the setup wizard
6. Vercel will automatically set `DATABASE_URL` environment variable

### Option B: Neon (Recommended for Free Tier)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/database`)
4. Add to Vercel environment variables as `DATABASE_URL`

### Option C: Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI mode)
5. Add to Vercel environment variables as `DATABASE_URL`

---

## Initialize Database Schema

After deploying and setting up the database:

### Method 1: Using Drizzle Kit (Recommended)

```bash
# Install dependencies locally
npm install

# Set DATABASE_URL in your local .env
echo "DATABASE_URL=your_production_database_url" > .env

# Push schema to database
npm run db:push
```

### Method 2: Manual SQL

Connect to your PostgreSQL database and run:

```sql
CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    expires_at BIGINT,
    remaining_views INTEGER,
    max_views INTEGER
);

CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at);
CREATE INDEX IF NOT EXISTS idx_remaining_views ON pastes(remaining_views);
```

---

## Verify Deployment

### 1. Test Health Check

```bash
curl https://your-app.vercel.app/api/healthz
```

Expected response:
```json
{"ok":true}
```

### 2. Test Create Paste

```bash
curl -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from Vercel!","ttl_seconds":3600,"max_views":5}'
```

Expected response:
```json
{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}
```

### 3. Test Fetch Paste

```bash
curl https://your-app.vercel.app/api/pastes/abc123
```

Expected response:
```json
{
  "content": "Hello from Vercel!",
  "remaining_views": 4,
  "expires_at": "2026-01-28T17:00:00.000Z"
}
```

---

## Running Automated Tests Against Production

Update your test script to use the production URL:

```powershell
$baseUrl = "https://your-app.vercel.app"
# Set TEST_MODE=1 in Vercel environment variables
# Run the test script
.\test.ps1
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `Connection refused` or `timeout`

**Solutions**:
1. Check DATABASE_URL is correctly set in Vercel environment variables
2. Ensure database allows connections from Vercel IPs (usually 0.0.0.0/0 for serverless)
3. Verify database is running and accessible
4. Check connection string format: `postgresql://user:password@host:port/database`

### Build Failures

**Error**: `Module not found` or `Cannot find module`

**Solutions**:
1. Ensure all dependencies are in `package.json`
2. Delete `node_modules` and `package-lock.json`, then `npm install`
3. Check for TypeScript errors: `npm run build` locally

### Environment Variables Not Working

**Solutions**:
1. Redeploy after adding environment variables
2. Ensure variables are set for the correct environment (Production/Preview/Development)
3. Check variable names match exactly (case-sensitive)

### Pastes Not Expiring

**Solutions**:
1. Ensure `TEST_MODE=0` in production
2. Verify `force-dynamic` is set on all routes
3. Check database time is in milliseconds (BIGINT)

---

## Post-Deployment Checklist

- [ ] Health check returns `{"ok":true}`
- [ ] Can create pastes via UI
- [ ] Can create pastes via API
- [ ] Can view pastes via browser
- [ ] Can fetch pastes via API
- [ ] View count decrements correctly
- [ ] TTL expiry works
- [ ] 404 returned for expired/exhausted pastes
- [ ] Database schema is initialized
- [ ] Environment variables are set correctly
- [ ] All automated tests pass

---

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## Monitoring and Logs

### View Logs

1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Runtime Logs" and "Build Logs"

### Monitor Performance

1. Vercel automatically provides:
   - Response times
   - Error rates
   - Traffic analytics
2. Access via "Analytics" tab in project dashboard

---

## Scaling Considerations

The application is designed to scale automatically on Vercel:

- **Serverless Functions**: Auto-scale based on traffic
- **PostgreSQL**: Choose a provider with connection pooling (Neon, Supabase)
- **Rate Limiting**: Consider adding rate limiting for production
- **Caching**: Currently disabled for correctness (can enable for static assets)

---

## Security Best Practices

1. **Never commit `.env` files** (already in .gitignore)
2. **Use strong database passwords**
3. **Enable SSL for database connections** (most providers enable by default)
4. **Rotate database credentials periodically**
5. **Monitor for unusual traffic patterns**
6. **Consider adding rate limiting** for API endpoints

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM Docs**: https://orm.drizzle.team

---

**Your application is production-ready and optimized for Vercel deployment!** 🚀
