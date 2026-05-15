import {pgTable, uuid, text, jsonb, timestamp, integer, pgEnum, index} from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core'
import {InferSelectModel} from 'drizzle-orm';

import { platformMembership } from './platformMembership';
import { platform } from './platform'

export type Listing = InferSelectModel<typeof listings>

export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'paused', 'closed', 'expired'])

const geometry = customType<{ data: { lat: number; lng: number } }>({
    dataType() {
        return 'geometry(Point, 4326)'
    },
    toDriver(value) {
        return `ST_GeomFromGeoJSON('${JSON.stringify({ type: 'Point', coordinates: [value.lng, value.lat] })}')`
    },
    fromDriver(value: unknown) {
        const hex = Buffer.from(value as string, 'hex')
        const lng = hex.readDoubleBE(5)
        const lat = hex.readDoubleBE(13)
        return { lat, lng }
    },
})

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
    location: geometry('location'),
    searchRadiusKm: integer('searchRadiusKm'),

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
    index('listings_location_idx').using('gist', t.location)
])