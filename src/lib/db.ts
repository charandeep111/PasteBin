import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";

// For serverless environments (like Vercel), we should use a singleton pattern for the client
// Vercel Postgres requires SSL
const client = postgres(connectionString, {
    prepare: false,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined
});

export const db = drizzle(client, { schema });
