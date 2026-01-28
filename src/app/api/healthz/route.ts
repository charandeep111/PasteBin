import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check if DB is reachable
        await db.execute(sql`SELECT 1`);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
