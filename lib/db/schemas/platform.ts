import { pgTable, uuid, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core'

export type FieldSchema = {
    key:        string
    label:      string
    type:       'text' | 'number' | 'select' | 'multiselect' | 'date' | 'location'
    required?:  boolean
    options?:   string[]
    column?:    'title' | 'description'
        | 'locationPoint' | 'locationLabel' | 'countryCode' | 'searchRadiusKm'
        | 'priceAmount' | 'priceCurrency' | 'priceType'
        | 'availableFrom' | 'availableUntil'
}

export type WizardStep = { title?: string, fields: FieldSchema[] }
export type ListingSchemas = Record<string, WizardStep[]>
export type Platform = typeof platform.$inferSelect

export type PlatformConfig = {
    roles: string[],
    appName: string,
}

export const platform = pgTable('platform', {
    id:             uuid('id').primaryKey().defaultRandom(),
    slug:           text('slug').notNull().unique(),
    listingSchemas: jsonb('listingSchemas').$type<ListingSchemas>().notNull().default({ offer: [], request: [] }),
    schemaVersion:  integer('schemaVersion').notNull().default(1),
    config:         jsonb('config').$type<PlatformConfig>().notNull().default({ roles: [], appName: 'App' }),
    createdAt:      timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
})