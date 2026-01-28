import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pastes } from '@/lib/schema';
import { eq, and, or, isNull, gt, sql } from 'drizzle-orm';
import { getCurrentTime } from '@/lib/time';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const now = getCurrentTime();

        // 1. Atomic query: Find, check constraints, and decrement (if needed) in one step.
        // This query will only modify/return a row if:
        // - The ID matches
        // - It's not expired (expires_at is null OR > now)
        // - It has views left (remaining_views is null OR > 0)
        const results = await db.update(pastes)
            .set({
                remaining_views: sql`CASE 
                    WHEN ${pastes.remaining_views} IS NULL THEN NULL 
                    ELSE ${pastes.remaining_views} - 1 
                END`
            })
            .where(and(
                eq(pastes.id, id),
                or(isNull(pastes.expires_at), gt(pastes.expires_at, now)),
                or(isNull(pastes.remaining_views), gt(pastes.remaining_views, 0))
            ))
            .returning();

        const result = results[0];

        if (!result) {
            return NextResponse.json({ error: 'Paste not found or expired' }, { status: 404 });
        }

        return NextResponse.json({
            content: result.content,
            remaining_views: result.remaining_views,
            expires_at: result.expires_at ? new Date(result.expires_at).toISOString() : null,
        });

    } catch (error) {
        console.error('Failed to fetch paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
