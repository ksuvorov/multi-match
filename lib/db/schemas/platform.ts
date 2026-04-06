import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export type FieldSchema = {
    key: string
    label: string
    type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'location'
    required?: boolean
    options?: string[]
}

export const platform = pgTable('platform', {
    id:            uuid('id').primaryKey().defaultRandom(),
    slug:          text('slug').notNull().unique(),
    domain:        text('domain').notNull().unique(),
    name:          text('name').notNull(),
    providerLabel: text('providerLabel').notNull().default('Provider'),
    seekerLabel:   text('seekerLabel').notNull().default('Seeker'),
    listingSchema: jsonb('listingSchema').$type<FieldSchema[]>().notNull().default([]),
    requestSchema: jsonb('requestSchema').$type<FieldSchema[]>().notNull().default([]),
    createdAt:     timestamp('createdAt').notNull().defaultNow(),
})