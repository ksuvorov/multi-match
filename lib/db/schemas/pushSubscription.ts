import {pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';

export const pushSubscription = pgTable("push_subscription", {
    id:        uuid("id").primaryKey().defaultRandom(),
    membershipId: text("membership_id").notNull(),
    endpoint:  text("endpoint").notNull().unique(),
    p256dh:    text("p256dh").notNull(),
    auth:      text("auth").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});