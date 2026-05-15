import {and, eq, lte, gte, isNull, or, ne, inArray, aliasedTable, sql, SQL} from 'drizzle-orm'

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

export async function getMembershipMatches(
    membershipId: string,
    role: string,
    filter: 'active' | 'all' = 'active',
) {
    const now = new Date()

    const memberListingIds = db
        .select({ id: listings.id })
        .from(listings)
        .where(and(
            eq(listings.membershipId, membershipId),
            eq(listings.role, role),
        ))

    const listingA = aliasedTable(listings, 'listingA')
    const listingB = aliasedTable(listings, 'listingB')

    const isMine = sql<boolean>`${listingA.membershipId} = ${membershipId}`

    let condition: SQL = or(
        inArray(matches.listingAId, memberListingIds),
        inArray(matches.listingBId, memberListingIds),
    )!

    if (filter === 'active') {
        condition = and(
            condition,
            ne(matches.status, 'rejected'),
            or(isNull(listingA.availableUntil), gte(listingA.availableUntil, now))!,
            or(isNull(listingB.availableUntil), gte(listingB.availableUntil, now))!,
        )!
    }

    return db
        .select({
            match: matches,
            myListing: {
                id:             sql<string>`CASE WHEN ${isMine} THEN ${listingA.id} ELSE ${listingB.id} END`,
                title:          sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.title} ELSE ${listingB.title} END`,
                availableFrom:  sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.availableFrom} ELSE ${listingB.availableFrom} END`,
                availableUntil: sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.availableUntil} ELSE ${listingB.availableUntil} END`,
            },
            counterpart: {
                id:            sql<string>`CASE WHEN ${isMine} THEN ${listingB.id} ELSE ${listingA.id} END`,
                membershipId:  sql<string>`CASE WHEN ${isMine} THEN ${listingB.membershipId} ELSE ${listingA.membershipId} END`,
                title:         sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.title} ELSE ${listingA.title} END`,
                description:   sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.description} ELSE ${listingA.description} END`,
                role:          sql<string>`CASE WHEN ${isMine} THEN ${listingB.role} ELSE ${listingA.role} END`,
                locationLabel: sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.locationLabel} ELSE ${listingA.locationLabel} END`,
                availableFrom:  sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableFrom} ELSE ${listingA.availableFrom} END`,
                availableUntil: sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableUntil} ELSE ${listingA.availableUntil} END`,
            },
            myApprovedAt:          sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingAApprovedAt} ELSE ${matches.listingBApprovedAt} END`,
            counterpartApprovedAt: sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingBApprovedAt} ELSE ${matches.listingAApprovedAt} END`,
        })
        .from(matches)
        .innerJoin(listingA, eq(listingA.id, matches.listingAId))
        .innerJoin(listingB, eq(listingB.id, matches.listingBId))
        .where(condition)
        .orderBy(matches.createdAt)
}