'use server'

import { and, eq, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';

import { getPlatformMembership } from '@/lib/db/queries/platformMembership';
import { listings } from '@/lib/db/schemas/listing';
import { getMatch } from '@/lib/db/queries/match';
import db from '@/lib/db';

import type { ActionResult, MatchParticipantContext } from './types';

export async function getMatchParticipantContext(
    matchId: string,
): Promise<ActionResult<MatchParticipantContext>> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { ok: false, error: 'Unauthorized', status: 401 };

    const match = await getMatch(matchId);
    if (!match) return { ok: false, error: 'Match not found', status: 404 };

    const membership = await getPlatformMembership(match.platformId, session.user.id);
    if (!membership) return { ok: false, error: 'Not a member', status: 403 };

    const listing = await db.query.listings.findFirst({
        where: and(
            eq(listings.membershipId, membership.id),
            inArray(listings.id, [match.listingAId, match.listingBId]),
        ),
        columns: { id: true },
    });
    if (!listing) return { ok: false, error: 'Not a match participant', status: 403 };

    return { ok: true, data: { match, membership, listing } };
}