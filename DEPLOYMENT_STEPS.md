# GitHub and Vercel Deployment Commands

## Step 1: Create GitHub Repository

1. Open your browser and go to: https://github.com/new
2. Fill in the details:
   - Repository name: pastebin-lite (or your preferred name)
   - Description: Production-ready Pastebin-Lite application with TTL and view limits
   - Visibility: Public (or Private if you prefer)
   - ⚠️ DO NOT check "Add a README file"
   - ⚠️ DO NOT add .gitignore (we already have one)
   - ⚠️ DO NOT choose a license yet
3. Click "Create repository"

## Step 2: Copy Your Repository URL

After creating the repository, GitHub will show you a URL like:
https://github.com/YOUR_USERNAME/pastebin-lite.git

Copy this URL - you'll need it for the next step.

## Step 3: Connect and Push to GitHub

Run these commands in your terminal (replace YOUR_USERNAME with your actual GitHub username):

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

If prompted for credentials:
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select: repo (full control of private repositories)
  - Copy the token and use it as password

## Step 4: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Sign in with GitHub (recommended) or email
3. Click "Import Git Repository"
4. You'll see your repositories - select "pastebin-lite"
5. Configure project:
   - Project Name: pastebin-lite (or customize)
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: ./ (leave as default)
   - Build Command: npm run build (auto-detected)
   - Output Directory: .next (auto-detected)
6. Click "Deploy"

Vercel will now build and deploy your application!

## Step 5: Set Up Database

### Option A: Vercel Postgres (Easiest)

1. While deployment is running, go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a region (closest to your users)
6. Click "Create"
7. Vercel automatically sets DATABASE_URL environment variable
8. Go to "Deployments" and redeploy latest deployment

### Option B: Neon (Free Tier)

1. Go to: https://neon.tech
2. Sign up (free)
3. Click "Create Project"
4. Project name: pastebin-lite-db
5. Region: Choose closest to your Vercel region
6. Click "Create Project"
7. Copy the connection string (looks like: postgresql://user:password@host/database)
8. In Vercel:
   - Go to Settings → Environment Variables
   - Click "Add New"
   - Key: DATABASE_URL
   - Value: Paste your Neon connection string
   - Environment: Production, Preview, Development (select all)
   - Click "Save"
9. Redeploy your application

## Step 6: Set Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add TEST_MODE:
   - Key: TEST_MODE
   - Value: 0
   - Environment: Production, Preview, Development
   - Click "Save"
3. If you added DATABASE_URL manually, it should already be there

## Step 7: Initialize Database Schema

After database is set up, run this locally:

```bash
# Update your local .env file with production DATABASE_URL
# Then run:
npm run db:push
```

This creates the pastes table in your production database.

## Step 8: Test Your Deployment

Your app will be live at: https://your-project-name.vercel.app

Test these endpoints:

1. Health Check:
   https://your-project-name.vercel.app/api/healthz
   Should return: {"ok":true}

2. Home Page:
   https://your-project-name.vercel.app
   Should show the paste creation form

3. Create a paste and verify it works!

## Troubleshooting

### If deployment fails:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript has no errors

### If database connection fails:
- Verify DATABASE_URL is set correctly
- Check database allows connections from 0.0.0.0/0
- Ensure connection string includes password

### If pastes don't work:
- Verify database schema is initialized (run db:push)
- Check environment variables are set
- Look at runtime logs in Vercel

## Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Database created and connected
- [ ] Environment variables set (DATABASE_URL, TEST_MODE)
- [ ] Database schema initialized
- [ ] Health check returns {"ok":true}
- [ ] Can create and view pastes
- [ ] View counts decrement
- [ ] TTL expiry works

## Next Steps After Deployment

1. Test all functionality
2. Run automated tests against production
3. (Optional) Add custom domain
4. (Optional) Set up monitoring
5. Share your app!

---

Your deployment URL will be: https://[your-project-name].vercel.app

Good luck! 🚀
