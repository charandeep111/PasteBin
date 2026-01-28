import { db } from '@/lib/db';
import { pastes } from '@/lib/schema';
import { eq, and, or, isNull, gt, sql } from 'drizzle-orm';
import { getCurrentTime } from '@/lib/time';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function PasteView({ params }: { params: { id: string } }) {
    const { id } = params;
    const now = getCurrentTime();

    // 1. Atomic query: Find, check constraints, and decrement (if needed) in one step.
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
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                            Paste {id}
                        </h1>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {result.remaining_views !== null ? `Remaining views: ${result.remaining_views}` : 'Unlimited views'}
                        </div>
                    </div>
                    <div className="p-6">
                        <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                            {result.content}
                        </pre>
                    </div>
                    {result.expires_at && (
                        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Expires at: {new Date(result.expires_at).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
                    >
                        ← Create a new paste
                    </a>
                </div>
            </div>
        </div>
    );
}
