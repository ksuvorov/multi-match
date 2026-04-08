import {
    pgTable, uuid, text, jsonb, timestamp,
    integer, numeric, pgEnum, index
} from 'drizzle-orm/pg-core'

import { platformMembership } from './platformMembership';
import { platform } from './platform'

export const listingTypeEnum   = pgEnum('listing_type',   ['offer', 'request'])
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'paused', 'closed', 'expired'])
export const geoTypeEnum       = pgEnum('geo_type',       ['none', 'point', 'point_radius', 'remote'])
export const priceTypeEnum     = pgEnum('price_type',     ['fixed', 'hourly', 'daily', 'negotiable'])

export const listings = pgTable('listings', {
    // --- Identity ---
    id:             uuid('id').primaryKey().defaultRandom(),
    platformId:     uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),
    membershipId: uuid('membershipId').notNull().references(() => platformMembership.id, { onDelete: 'cascade' }),
    listingType:    listingTypeEnum('listingType').notNull(),
    status:         listingStatusEnum('status').notNull().default('draft'),

    // --- Content ---
    title:          text('title').notNull(),
    description:    text('description'),

    // --- Tenant custom fields ---
    schemaVersion:  integer('schemaVersion').notNull().default(1),
    meta:           jsonb('meta').$type<Record<string, unknown>>().notNull().default({}),

    // --- Geo ---
    geoType:        geoTypeEnum('geoType').notNull().default('none'),
    locationPoint:  jsonb('locationPoint').$type<{ lat: number; lng: number } | null>().default(null),
    searchRadiusKm: integer('searchRadiusKm'),
    locationLabel:  text('locationLabel'),
    countryCode:    text('countryCode'),

    // --- Pricing ---
    priceAmount:    numeric('priceAmount', { precision: 12, scale: 2 }),
    priceCurrency:  text('priceCurrency').default('USD'),
    priceType:      priceTypeEnum('priceType'),

    // --- Schedule ---
    availableFrom:  timestamp('availableFrom',  { withTimezone: true }),
    availableUntil: timestamp('availableUntil', { withTimezone: true }),
    expiresAt:      timestamp('expiresAt',      { withTimezone: true }),

    createdAt:      timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    index('listings_platform_idx').on(t.platformId),
    index('listings_membership_idx').on(t.membershipId),
    index('listings_platform_type_status_idx').on(t.platformId, t.listingType, t.status),
])