'use server'

import { eq } from 'drizzle-orm';

import { matches } from '@/lib/db/schemas/match';
import db from '@/lib/db';

import { getMatchParticipantContext } from './helpers';
import type { ActionResult } from './types';

export async function rejectMatch(matchId: string): Promise<ActionResult> {
    const ctx = await getMatchParticipantContext(matchId);
    if (!ctx.ok) return ctx;

    const { match, listing } = ctx.data;
    const isA = listing.id === match.listingAId;
    const now = new Date();

    await db.update(matches)
        .set({
            ...(isA ? { listingARejectedAt: now } : { listingBRejectedAt: now }),
        })
        .where(eq(matches.id, ctx.data.match.id));

    return { ok: true };
}