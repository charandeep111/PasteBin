# Quick Deployment Steps

## ✅ Completed Steps

- [x] Git repository initialized
- [x] All files committed
- [x] .gitignore configured
- [x] vercel.json created
- [x] Application tested locally (13/13 tests passed)
- [x] Critical caching fix applied
- [x] Documentation created

## 🚀 Next Steps to Deploy

### Option 1: Deploy via GitHub + Vercel Dashboard (Easiest)

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create a new repository (e.g., "pastebin-lite")
   - Don't initialize with README (we already have files)

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Set Up Database**
   - Option A: Use Vercel Postgres (easiest)
     - In Vercel dashboard → Storage → Create Database → Postgres
     - DATABASE_URL will be set automatically
   
   - Option B: Use Neon (free tier)
     - Sign up at https://neon.tech
     - Create project and copy connection string
     - In Vercel → Settings → Environment Variables
     - Add: `DATABASE_URL` = your connection string

5. **Set Environment Variables**
   - In Vercel → Settings → Environment Variables
   - Add: `TEST_MODE` = `0` (for production)
   - Redeploy if needed

6. **Initialize Database Schema**
   ```bash
   # Set DATABASE_URL in local .env to your production database
   npm run db:push
   ```

7. **Test Your Deployment**
   - Visit: https://your-app.vercel.app/api/healthz
   - Should return: {"ok":true}
   - Create a test paste via the UI

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts, then:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   # Paste your PostgreSQL connection string
   
   vercel env add TEST_MODE
   # Enter: 0
   ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## 📋 Post-Deployment Checklist

After deployment, verify:

- [ ] Health check works: `curl https://your-app.vercel.app/api/healthz`
- [ ] Can create paste via UI
- [ ] Can view paste via browser
- [ ] View count decrements correctly
- [ ] TTL expiry works (test with short TTL)
- [ ] 404 returned for expired pastes
- [ ] Database schema is initialized

---

## 🔧 Database Setup Options

### Vercel Postgres (Recommended for Vercel)
- Easiest integration
- Automatic environment variable setup
- Pay-as-you-go pricing
- https://vercel.com/docs/storage/vercel-postgres

### Neon (Recommended for Free Tier)
- Free tier: 0.5 GB storage
- Serverless Postgres
- Auto-scaling
- https://neon.tech

### Supabase
- Free tier: 500 MB storage
- Includes additional features (auth, storage, etc.)
- https://supabase.com

---

## 🎯 Current Status

Your application is:
- ✅ Production-ready
- ✅ All tests passing (13/13)
- ✅ Spec-compliant
- ✅ Git repository initialized
- ✅ Ready for deployment

**Just choose a deployment method above and follow the steps!**

---

## 📚 Documentation Available

- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `AUDIT_REPORT.md` - Detailed audit findings
- `IMPLEMENTATION_REVIEW.md` - Implementation review summary
- `CRITICAL_FIX_EXPLANATION.md` - Explanation of the caching fix
- `README.md` - Project overview and local setup
- `test.ps1` - Automated test script

---

## 🆘 Need Help?

Refer to `DEPLOYMENT_GUIDE.md` for:
- Detailed step-by-step instructions
- Troubleshooting common issues
- Database setup guides
- Testing procedures
- Security best practices
