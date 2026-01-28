import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pastes } from '@/lib/schema';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '@/lib/time';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, ttl_seconds, max_views } = body;

        // Validation
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return NextResponse.json({ error: 'content is required and must be a non-empty string' }, { status: 400 });
        }

        if (ttl_seconds !== undefined) {
            if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
                return NextResponse.json({ error: 'ttl_seconds must be an integer >= 1' }, { status: 400 });
            }
        }

        if (max_views !== undefined) {
            if (!Number.isInteger(max_views) || max_views < 1) {
                return NextResponse.json({ error: 'max_views must be an integer >= 1' }, { status: 400 });
            }
        }

        const id = nanoid(10);
        const now = getCurrentTime();
        const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

        await db.insert(pastes).values({
            id,
            content,
            created_at: now,
            expires_at,
            remaining_views: max_views ?? null,
            max_views: max_views ?? null,
        });

        // Get the host from headers to avoid hardcoded localhost
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const baseUrl = `${protocol}://${host}`;

        return NextResponse.json({
            id,
            url: `${baseUrl}/p/${id}`,
        }, { status: 201 });

    } catch (error) {
        console.error('Failed to create paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
