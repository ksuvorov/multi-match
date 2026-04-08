import { pgTable, uuid, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core'

export type FieldSchema = {
    key:        string
    label:      string
    type:       'text' | 'number' | 'select' | 'multiselect' | 'date' | 'location'
    required?:  boolean
    options?:   string[]
    column?:    'locationPoint' | 'locationLabel' | 'countryCode' | 'searchRadiusKm'
        | 'priceAmount' | 'priceCurrency' | 'priceType'
        | 'availableFrom' | 'availableUntil'
}

export type ListingSchemas = {
    offer:   FieldSchema[]
    request: FieldSchema[]
}

export const platform = pgTable('platform', {
    id:             uuid('id').primaryKey().defaultRandom(),
    slug:           text('slug').notNull().unique(),
    listingSchemas: jsonb('listingSchemas').$type<ListingSchemas>().notNull().default({ offer: [], request: [] }),
    schemaVersion:  integer('schemaVersion').notNull().default(1),
    createdAt:      timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})