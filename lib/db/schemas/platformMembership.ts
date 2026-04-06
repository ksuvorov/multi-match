import { pgTable, uuid, text, timestamp, index, unique } from 'drizzle-orm/pg-core'

import { user } from '../../auth/schema'
import { platform } from './platform'

export const platformMembership = pgTable('platformMembership', {
    id:         uuid('id').primaryKey().defaultRandom(),
    platformId: uuid('platformId').notNull().references(() => platform.id, { onDelete: 'cascade' }),
    userId:     text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    roles:      text('roles').array().notNull().default([]),
    joinedAt:   timestamp('joinedAt').notNull().defaultNow(),
}, t => [
    unique().on(t.platformId, t.userId),
    index('platformMembership_platformId_idx').on(t.platformId),
    index('platformMembership_userId_idx').on(t.userId),
])