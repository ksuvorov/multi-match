import { and, eq, lte, gte, isNull, or, ne } from 'drizzle-orm'

import { PlatformConfig } from '@/lib/db/schemas/platform'
import * as schema from '@/lib/db/schema'
import db from '@/lib/db'

export async function detectAndCreateMatches(
    newListing: typeof schema.listings.$inferSelect,
    config: PlatformConfig,
) {
    try {
        const [roleA, roleB] = config.roles; // now we assume that we have only 2 roles
        const oppositeRole = newListing.role === roleA ? roleB : roleA

        if (!oppositeRole) return []

        const from  = newListing.availableFrom ?? null
        const until = newListing.availableUntil ?? null

        const conditions = [
            eq(schema.listings.platformId, newListing.platformId),
            eq(schema.listings.role, oppositeRole),
            eq(schema.listings.status, 'active'),
            ne(schema.listings.membershipId, newListing.membershipId),
        ]

        if (until !== null) {
            conditions.push(
                or(
                    isNull(schema.listings.availableFrom),
                    lte(schema.listings.availableFrom, until),
                )!
            )
        }

        if (from !== null) {
            conditions.push(
                or(
                    isNull(schema.listings.availableUntil),
                    gte(schema.listings.availableUntil, from),
                )!
            )
        }

        const candidates = await db
            .select()
            .from(schema.listings)
            .where(and(...conditions))

        if (candidates.length) {
            const values = candidates.map(candidate => ({
                platformId: newListing.platformId,
                listingAId: newListing.id,
                listingBId: candidate.id,
                origin: 'auto' as const,
                listingAApprovedAt: null,
                listingBApprovedAt: null,
            }))

            await db
                .insert(schema.matches)
                .values(values)
                .onConflictDoNothing()
        }

        await db.update(schema.listings)
            .set({ matchedAt: new Date(), matchingError: null })
            .where(eq(schema.listings.id, newListing.id))

        return candidates
    } catch (e) {
        await db.update(schema.listings)
            .set({ matchingError: String(e) })
            .where(eq(schema.listings.id, newListing.id))

        throw e
    }
}