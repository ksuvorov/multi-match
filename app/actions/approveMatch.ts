'use server'

import { matchContacts } from '@/lib/db/schemas/matchContact';
import { matches } from '@/lib/db/schemas/match';
import { eq } from 'drizzle-orm';
import db from '@/lib/db';

import { getMatchParticipantContext } from './helpers';
import type { ActionResult } from './types';

export async function approveMatch(
    matchId: string,
    contact: string,
): Promise<ActionResult> {
    if (!contact?.trim()) return { ok: false, error: 'Contact is required', status: 400 };

    const ctx = await getMatchParticipantContext(matchId);
    if (!ctx.ok) return ctx;

    const { match, membership, listing } = ctx.data;
    const isA = listing.id === match.listingAId;
    const isConfirmed = isA ? !!match.listingBApprovedAt : !!match.listingAApprovedAt;
    const now = new Date();

    await db.insert(matchContacts)
        .values({ matchId, membershipId: membership.id, contact })
        .onConflictDoUpdate({
            target: [matchContacts.matchId, matchContacts.membershipId],
            set: { contact },
        });

    await db.update(matches)
        .set({
            ...(isA ? { listingAApprovedAt: now } : { listingBApprovedAt: now }),
        })
        .where(eq(matches.id, matchId));

    return { ok: true };
}