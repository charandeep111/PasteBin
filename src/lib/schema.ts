import { pgTable, text, integer, bigint } from 'drizzle-orm/pg-core';

export const pastes = pgTable('pastes', {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    created_at: bigint('created_at', { mode: 'number' }).notNull(),
    expires_at: bigint('expires_at', { mode: 'number' }), // timestamp in ms
    remaining_views: integer('remaining_views'),
    max_views: integer('max_views'),
});
