import {pgTable, uuid, text, jsonb, timestamp, integer, pgEnum, index} from 'drizzle-orm/pg-core'
import {InferSelectModel} from 'drizzle-orm';

import { platformMembership } from './platformMembership';
import { platform } from './platform'

export type Listing = InferSelectModel<typeof listings>

export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'paused', 'closed', 'expired'])

export const listings = pgTable('listings', {
    // --- Identity ---
    id:             uuid('id').primaryKey().defaultRandom(),
    platformId:     uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),
    membershipId:   uuid('membershipId').notNull().references(() => platformMembership.id, { onDelete: 'cascade' }),
    role:           text('role').notNull(),
    status:         listingStatusEnum('status').notNull().default('draft'),

    // --- Content ---
    title:          text('title'),
    description:    text('description'),

    // --- Tenant custom fields ---
    meta:           jsonb('meta').$type<Record<string, unknown>>().notNull().default({}),

    // --- Geo ---
    locationPoint:  jsonb('locationPoint').$type<{ lat: number; lng: number } | null>().default(null),
    searchRadiusKm: integer('searchRadiusKm'),
    locationLabel:  text('locationLabel'),

    // --- Schedule ---
    availableFrom:  timestamp('availableFrom',  { withTimezone: true }),
    availableUntil: timestamp('availableUntil', { withTimezone: true }),

    // --- Matching ---
    matchedAt:      timestamp('matchedAt', { withTimezone: true }),
    matchingError:  text('matchingError'),

    createdAt:      timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    index('listings_platform_idx').on(t.platformId),
    index('listings_membership_idx').on(t.membershipId),
    index('listings_platform_role_status_idx').on(t.platformId, t.role, t.status),
])