import { pgTable, uuid, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core'

import { platform } from './platform'
import { listings } from './listing'

export const matchOriginEnum = pgEnum('match_origin', [
    'auto',
    'initiated',
])

export type Match = typeof matches.$inferSelect
export const matches = pgTable('matches', {
    id:         uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),

    listingAId: uuid('listingAId').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    listingBId: uuid('listingBId').notNull().references(() => listings.id, { onDelete: 'cascade' }),

    origin: matchOriginEnum('origin').notNull().default('auto'),

    listingAApprovedAt: timestamp('listingAApprovedAt', { withTimezone: true }),
    listingBApprovedAt: timestamp('listingBApprovedAt', { withTimezone: true }),
    listingARejectedAt: timestamp('listingARejectedAt', { withTimezone: true }),
    listingBRejectedAt: timestamp('listingBRejectedAt', { withTimezone: true }),

    createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    uniqueIndex('matches_ab_unique').on(t.listingAId, t.listingBId),

    index('matches_platform_idx').on(t.platformId),
    index('matches_listingA_idx').on(t.listingAId),
    index('matches_listingB_idx').on(t.listingBId),
])