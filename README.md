# Pastebin-Lite

A production-ready Pastebin-like web application built with Next.js, Drizzle ORM, and SQLite.

## Features

- **Create Pastes**: Share text content with customizable TTL (Time To Live) and maximum view limits.
- **Deterministic Time Handling**: Support for `TEST_MODE` to allow automated testing with mock time.
- **Atomic Operations**: View counts are updated atomically using database transactions.
- **Safe Rendering**: All content is safely escaped to prevent XSS.
- **Responsive Design**: Minimal yet premium UI built with Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Persistence**: PostgreSQL (via `postgres` driver)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS

## Local Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pastebin-lite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   TEST_MODE=0
   DATABASE_URL=postgres://user:password@host:5432/database
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```
   Ensure your PostgreSQL database is running and accessible via the `DATABASE_URL`.

## API Documentation

### Health Check
`GET /api/healthz`
- Returns `200 OK` with `{ "ok": true }` if the server and database are reachable.

### Create Paste
`POST /api/pastes`
- Body: `{ "content": "string", "ttl_seconds": 60, "max_views": 5 }`
- Returns: `{ "id": "string", "url": "string" }`

### Fetch Paste (API)
`GET /api/pastes/:id`
- Returns paste content and metadata.
- Automatically decrements `remaining_views`.

### View Paste (HTML)
`GET /p/:id`
- Renders the paste in a browser-friendly format.
- Automatically decrements `remaining_views`.

## Persistence Layer Explanation

This application uses **PostgreSQL** for persistence.
- **Atomic Updates**: All view count decrements and availability checks are performed within a database transaction to ensure consistency under concurrent load.
- **Serverless-Ready**: The PostgreSQL connection is configured for serverless environments using the `postgres` driver with `prepare: false`.
- **Deployment**: This architecture works seamlessly with serverless PostgreSQL providers like Neon, Supabase, or Vercel Postgres for production deployments.

## Testing

To run with deterministic time:
```bash
TEST_MODE=1 npm run dev
```
Then send the `x-test-now-ms` header with your requests.
