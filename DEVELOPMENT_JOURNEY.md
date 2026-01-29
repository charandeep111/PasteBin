# Development & Problem Solving Journey

## Overview
This document outlines the collaborative problem-solving process between the developer and the AI assistant (Antigravity) to build and deploy the **Pastebin-Lite** application.

## Key Challenges & Solutions

### 1. Database Connection in Production (Vercel)
**Problem:** 
The application failed to connect to the database after deployment to Vercel, throwing `Internal Server Error`.

**Diagnosis:**
- The application was configured to use `localhost` in the `.env` file, which works locally but fails in the cloud.
- Vercel Postgres requires an SSL connection, which wasn't explicitly enforced in the initial `db.ts` configuration.

**Solution:**
- **Code Update:** Modified `src/lib/db.ts` to strictly enforce SSL when running in production (`ssl: 'require'`).
- **Configuration:** Updated the project `DATABASE_URL` to point to the live Vercel Postgres instance instead of localhost.
- **Schema Migration:** Ran `npm run db:push` locally using the production connection string to ensure tables existed in the live database.

### 2. Environment Variable Conflicts
**Problem:**
Vercel could not automatically connect the database because a manual `DATABASE_URL` variable already existed.

**Solution:**
- Directed to manually delete the conflicting variable in Vercel settings.
- Re-connected the database via the Vercel "Storage" tab to auto-generate secure credentials.

### 3. Deployment Workflow
**Approach:**
- Initialized a Git repository.
- Connected to GitHub (`charandeep111/PasteBin`).
- Deployed to Vercel via Git integration.
- Verified deployment using `curl` to check the `/api/healthz` endpoint, confirming a status of `{"ok":true}`.

## Technical Stack Verification
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (via Vercel/Neon)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS

## Conclusion
The application uses a serverless-safe architecture with a singleton database client pattern. Critical fixes were applied to handle production SSL requirements, ensuring a robust deployment.
