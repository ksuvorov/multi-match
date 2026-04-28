import {and, eq, lte, gte, isNull, or, ne, inArray, aliasedTable, sql} from 'drizzle-orm'

import { PlatformConfig } from '@/lib/db/schemas/platform'
import {listings, matches} from '@/lib/db/schema';
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

export type DashboardMatch = Awaited<ReturnType<typeof getMembershipMatches>>[number]
export async function getMembershipMatches(membershipId: string, role: string) {
    const memberListingIds = db
        .select({ id: listings.id })
        .from(listings)
        .where(and(
            eq(listings.membershipId, membershipId),
            eq(listings.role, role),
        ))

    const listingA = aliasedTable(listings, 'listingA')
    const listingB = aliasedTable(listings, 'listingB')

    return db
        .select({
            match: matches,
            counterpart: {
                id:            sql<string>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.id} ELSE ${listingA.id} END`,
                title:         sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.title} ELSE ${listingA.title} END`,
                description:   sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.description} ELSE ${listingA.description} END`,
                role:          sql<string>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.role} ELSE ${listingA.role} END`,
                locationLabel: sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.locationLabel} ELSE ${listingA.locationLabel} END`,
                priceAmount:   sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.priceAmount} ELSE ${listingA.priceAmount} END`,
                priceCurrency: sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.priceCurrency} ELSE ${listingA.priceCurrency} END`,
                priceType:     sql<string | null>`CASE WHEN ${listingA.membershipId} = ${membershipId} THEN ${listingB.priceType} ELSE ${listingA.priceType} END`,
            },
        })
        .from(matches)
        .innerJoin(listingA, eq(listingA.id, matches.listingAId))
        .innerJoin(listingB, eq(listingB.id, matches.listingBId))
        .where(
            or(
                inArray(matches.listingAId, memberListingIds),
                inArray(matches.listingBId, memberListingIds),
            )
        )
        .orderBy(matches.createdAt)
}