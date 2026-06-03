import {and, eq, lte, gte, isNull, or, ne, inArray, aliasedTable, sql, SQL} from 'drizzle-orm'

import { listings, matchContacts, matches } from '@/lib/db/schema';
import { PlatformConfig } from '@/lib/db/schemas/platform'
import { parseWKBPoint } from '@/lib/location';
import * as schema from '@/lib/db/schema'
import db from '@/lib/db'

export async function getMatch(id: string) {
    return db.query.matches.findFirst({
        where: eq(schema.matches.id, id),
    })
}

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

        const radiusMeters = (newListing.searchRadiusKm ?? 0) * 1000

        conditions.push(
            sql`
                ST_DWithin(
                    ${schema.listings.location}::geography,
                    ST_SetSRID(
                        ST_MakePoint(
                            ${newListing.location.lng},
                            ${newListing.location.lat}
                        ),
                        4326
                    )::geography,
                    ${radiusMeters} + COALESCE(${schema.listings.searchRadiusKm}, 0) * 1000
                )
            `
        )

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
            isNull(matches.listingARejectedAt),
            isNull(matches.listingBRejectedAt),
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
                availableFrom:  sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableFrom} ELSE ${listingA.availableFrom} END`,
                availableUntil: sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableUntil} ELSE ${listingA.availableUntil} END`,
            },
            myApprovedAt:          sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingAApprovedAt} ELSE ${matches.listingBApprovedAt} END`,
            counterpartApprovedAt: sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingBApprovedAt} ELSE ${matches.listingAApprovedAt} END`,
            myRejectedAt:          sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingARejectedAt} ELSE ${matches.listingBRejectedAt} END`,
            counterpartRejectedAt: sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingBRejectedAt} ELSE ${matches.listingARejectedAt} END`,
        })
        .from(matches)
        .innerJoin(listingA, eq(listingA.id, matches.listingAId))
        .innerJoin(listingB, eq(listingB.id, matches.listingBId))
        .where(condition)
        .orderBy(matches.createdAt)
}

export type MatchDetail = NonNullable<Awaited<ReturnType<typeof getMatchDetail>>>
export type MatchListingData = MatchDetail['myListing']
export async function getMatchDetail(matchId: string, membershipId: string) {
    const listingA = aliasedTable(listings, 'listingA')
    const listingB = aliasedTable(listings, 'listingB')

    const contactA = aliasedTable(matchContacts, 'contactA')
    const contactB = aliasedTable(matchContacts, 'contactB')

    const isMine = sql<boolean>`${listingA.membershipId} = ${membershipId}`

    const rows = await db
        .select({
            match: matches,
            myListing: {
                id:             sql<string>`CASE WHEN ${isMine} THEN ${listingA.id} ELSE ${listingB.id} END`,
                role:           sql<string>`CASE WHEN ${isMine} THEN ${listingA.role} ELSE ${listingB.role} END`,
                title:          sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.title} ELSE ${listingB.title} END`,
                description:    sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.description} ELSE ${listingB.description} END`,
                meta:           sql<Record<string, unknown>>`CASE WHEN ${isMine} THEN ${listingA.meta} ELSE ${listingB.meta} END`,
                availableFrom:  sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.availableFrom} ELSE ${listingB.availableFrom} END`,
                availableUntil: sql<string | null>`CASE WHEN ${isMine} THEN ${listingA.availableUntil} ELSE ${listingB.availableUntil} END`,
                location:       sql<string>`CASE WHEN ${isMine} THEN ${listingA.location} ELSE ${listingB.location} END`,
                searchRadiusKm: sql<number>`CASE WHEN ${isMine} THEN ${listingA.searchRadiusKm} ELSE ${listingB.searchRadiusKm} END`,
            },
            counterpart: {
                id:             sql<string>`CASE WHEN ${isMine} THEN ${listingB.id} ELSE ${listingA.id} END`,
                membershipId:   sql<string>`CASE WHEN ${isMine} THEN ${listingB.membershipId} ELSE ${listingA.membershipId} END`,
                role:           sql<string>`CASE WHEN ${isMine} THEN ${listingB.role} ELSE ${listingA.role} END`,
                title:          sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.title} ELSE ${listingA.title} END`,
                description:    sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.description} ELSE ${listingA.description} END`,
                meta:           sql<Record<string, unknown>>`CASE WHEN ${isMine} THEN ${listingB.meta} ELSE ${listingA.meta} END`,
                availableFrom:  sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableFrom} ELSE ${listingA.availableFrom} END`,
                availableUntil: sql<string | null>`CASE WHEN ${isMine} THEN ${listingB.availableUntil} ELSE ${listingA.availableUntil} END`,
                location:       sql<string>`CASE WHEN ${isMine} THEN ${listingB.location} ELSE ${listingA.location} END`,
                searchRadiusKm: sql<number>`CASE WHEN ${isMine} THEN ${listingB.searchRadiusKm} ELSE ${listingA.searchRadiusKm} END`,
            },
            myApprovedAt:          sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingAApprovedAt} ELSE ${matches.listingBApprovedAt} END`,
            counterpartApprovedAt: sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingBApprovedAt} ELSE ${matches.listingAApprovedAt} END`,
            myRejectedAt:          sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingARejectedAt} ELSE ${matches.listingBRejectedAt} END`,
            counterpartRejectedAt: sql<string | null>`CASE WHEN ${isMine} THEN ${matches.listingBRejectedAt} ELSE ${matches.listingARejectedAt} END`,
            counterpartContact:    sql<string | null>`CASE WHEN ${isMine} THEN ${contactB.contact} ELSE ${contactA.contact} END`,
        })
        .from(matches)
        .innerJoin(listingA, eq(listingA.id, matches.listingAId))
        .innerJoin(listingB, eq(listingB.id, matches.listingBId))
        .leftJoin(contactA, and(eq(contactA.matchId, matches.id), eq(contactA.membershipId, listingA.membershipId)))
        .leftJoin(contactB, and(eq(contactB.matchId, matches.id), eq(contactB.membershipId, listingB.membershipId)))
        .where(
            and(
                eq(matches.id, matchId),
                or(
                    inArray(matches.listingAId, db.select({ id: listings.id }).from(listings).where(eq(listings.membershipId, membershipId))),
                    inArray(matches.listingBId, db.select({ id: listings.id }).from(listings).where(eq(listings.membershipId, membershipId))),
                )!
            )
        )
        .limit(1)

    const row = rows[0]
    if (!row) return null

    return {
        ...row,
        myListing: {
            ...row.myListing,
            location: parseWKBPoint(row.myListing.location),
        },
        counterpart: {
            ...row.counterpart,
            location: parseWKBPoint(row.counterpart.location),
        },
    }
}