import { createMiddleware } from 'hono/factory';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';

import * as schema from '@/lib/db/schema';
import db from '@/lib/db';

import { getPlatformMembership } from '@/lib/db/queries/platformMembership';
import type { Listing, Match, PlatformMembership } from '@/lib/db/schema';
import { getMatch } from '@/lib/db/queries/match';

import { requireAuth } from '../middlewares/auth';

export const matchesRouter = new Hono();

type MatchParticipantContext = {
    Variables: {
        userId: string;
        match: Match;
        membership: PlatformMembership;
        listing: {
            id: Listing['id'],
        };
    };
};
export const requireMatchParticipant =
    createMiddleware<MatchParticipantContext>(async (c, next) => {
        const userId = c.get('userId');
        const matchId = c.req.param('id');

        if (!matchId) {
            return c.json({ error: 'Missing match id' }, 400);
        }
        const match = await getMatch(matchId);
        if (!match) {
            return c.json({ error: 'Match not found' }, 404);
        }

        const membership = await getPlatformMembership(
            match.platformId,
            userId,
        );

        if (!membership) {
            return c.json({ error: 'Not a member' }, 403);
        }

        const listing = await assertMatchMember(
            match,
            membership.id,
        );

        if (!listing) {
            return c.json({ error: 'Not a match participant' }, 403);
        }

        c.set('match', match);
        c.set('membership', membership);
        c.set('listing', listing);

        await next();
    });

async function assertMatchMember(match: Match, membershipId: string) {
    return db.query.listings.findFirst({
        where: and(
            eq(schema.listings.membershipId, membershipId),
            inArray(schema.listings.id, [match.listingAId, match.listingBId]),
        ),
        columns: { id: true },
    });
}

matchesRouter.post(
    '/:id/approve',
    requireAuth,
    requireMatchParticipant,
    async (c) => {
        const match = c.get('match');
        const matchId = match.id;
        const membership = c.get('membership');

        const body = await c.req.json();
        const contact = body.contact as string | undefined;
        if (!contact) {
            return c.json({ error: 'Contact is required' }, 400);
        }

        const listing = await assertMatchMember(match, membership.id);
        if (!listing) return c.json({ error: 'Not a match participant' }, 403);
        const isA = listing.id === match.listingAId;

        await db.insert(schema.matchContacts)
            .values({ matchId, membershipId: membership.id, contact })
            .onConflictDoUpdate({
                target: [schema.matchContacts.matchId, schema.matchContacts.membershipId],
                set: { contact },
            });

        const now = new Date();
        const isConfirmed = isA ? !!match.listingBApprovedAt : !!match.listingAApprovedAt;

        await db.update(schema.matches)
            .set({
                ...(isA ? { listingAApprovedAt: now } : { listingBApprovedAt: now }),
                ...(isConfirmed ? { status: 'confirmed', confirmedAt: now } : {}),
            })
            .where(eq(schema.matches.id, matchId));

        return c.json({ ok: true });
    }
);

matchesRouter.post(
    '/:id/reject',
    requireAuth,
    requireMatchParticipant,
    async (c) => {
        const match = c.get('match');

        await db.update(schema.matches)
            .set({ status: 'rejected' })
            .where(eq(schema.matches.id, match.id));

        return c.json({ ok: true });
    }
);