import {pgTable, uuid, timestamp, index, uniqueIndex, pgEnum} from 'drizzle-orm/pg-core'

import { listings } from './listing'
import { platform } from './platform'

export const matchStatusEnum = pgEnum('match_status', [
    'pending',
    'confirmed',
    'rejected',
])

export const matchOriginEnum = pgEnum('match_origin', [
    'auto',
    'initiated',
])

export const matches = pgTable('matches', {
    id:           uuid('id').primaryKey().defaultRandom(),
    platformId:   uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),

    offerId:      uuid('offerId').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    requestId:    uuid('requestId').notNull().references(() => listings.id, { onDelete: 'cascade' }),

    status:       matchStatusEnum('status').notNull().default('pending'),
    origin:       matchOriginEnum('origin').notNull().default('auto'),

    offerApprovedAt:    timestamp('offerApprovedAt',   { withTimezone: true }),
    requestApprovedAt:  timestamp('requestApprovedAt', { withTimezone: true }),
    confirmedAt:        timestamp('confirmedAt',        { withTimezone: true }),

    createdAt:    timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:    timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    uniqueIndex('matches_offer_request_unique').on(t.offerId, t.requestId),

    index('matches_platform_idx').on(t.platformId),
    index('matches_offer_idx').on(t.offerId),
    index('matches_request_idx').on(t.requestId),
    index('matches_status_idx').on(t.status),
])