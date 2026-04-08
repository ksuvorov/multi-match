import { pgTable, uuid, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';

import { platform, type ListingSchemas } from './platform';
import { platformMembership } from './platformMembership';

export const platformSchemaHistory = pgTable('platform_schema_history', {
    id:             uuid('id').primaryKey().defaultRandom(),
    platformId:     uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),
    version:        integer('version').notNull(),
    listingSchemas: jsonb('listingSchemas').$type<ListingSchemas>().notNull(),
    createdAt:      timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    createdBy:      uuid('createdBy').references(() => platformMembership.id, { onDelete: 'set null' }),
})