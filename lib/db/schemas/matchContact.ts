import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { platformMembership } from './platformMembership'
import { matches } from './match'

export const matchContacts = pgTable('match_contacts', {
    id:           uuid('id').primaryKey().defaultRandom(),
    matchId:      uuid('matchId').notNull().references(() => matches.id, { onDelete: 'cascade' }),
    membershipId: uuid('membershipId').notNull().references(() => platformMembership.id, { onDelete: 'cascade' }),
    contact:      text('contact').notNull(),
    createdAt:    timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
}, t => [
    unique().on(t.matchId, t.membershipId),
])