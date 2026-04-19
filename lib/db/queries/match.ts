import {and, eq, lte, gte, isNull, or, ne} from 'drizzle-orm'

import * as schema from '@/lib/db/schema'
import db from '@/lib/db'

export async function detectAndCreateMatches(
    newListing: typeof schema.listings.$inferSelect,
) {
    try {
        const oppositeType =
            newListing.listingType === 'offer' ? 'request' : 'offer'

        const from  = newListing.availableFrom ?? null
        const until = newListing.availableUntil ?? null

        const conditions = [
            eq(schema.listings.platformId, newListing.platformId),
            eq(schema.listings.listingType, oppositeType),
            eq(schema.listings.status, 'active'),
            ne(schema.listings.membershipId, newListing.membershipId)
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
            const values = candidates.map(candidate => {
                const isNewOffer = newListing.listingType === 'offer'

                return {
                    platformId: newListing.platformId,

                    offerId:   isNewOffer ? newListing.id : candidate.id,
                    requestId: isNewOffer ? candidate.id  : newListing.id,

                    origin: 'auto' as const,

                    offerApprovedAt:   null,
                    requestApprovedAt: null,
                }
            })

            await db
                .insert(schema.matches)
                .values(values)
                .onConflictDoNothing()
        }

        await db.update(schema.listings)
            .set({
                matchedAt: new Date(),
                matchingError: null,
            })
            .where(eq(schema.listings.id, newListing.id))

        return candidates
    } catch (e) {
        await db.update(schema.listings)
            .set({
                matchingError: String(e),
            })
            .where(eq(schema.listings.id, newListing.id))

        throw e
    }
}