import { eq, isNull, and } from 'drizzle-orm'
import { Hono } from 'hono'

import { detectAndCreateMatches } from '@/lib/db/queries/match'
import * as schema from '@/lib/db/schema'
import db from '@/lib/db'

export const matchingRouter = new Hono()

matchingRouter.post('/listing', async (c) => {
    const { listingId } = await c.req.json()

    if (!listingId) {
        return c.json({ error: 'Missing listingId' }, 400)
    }

    const now = new Date()

    const updated = await db
        .update(schema.listings)
        .set({
            matchedAt: now,
            matchingError: null,
        })
        .where(
            and(
                eq(schema.listings.id, listingId),
                isNull(schema.listings.matchedAt)
            )
        )
        .returning()

    if (!updated.length) {
        return c.json({ status: 'skipped' })
    }

    const listing = updated[0];

    const platformRow = await db.query.platform.findFirst({
        where: eq(schema.platform.id, listing.platformId),
    })

    if (!platformRow) {
        return c.json({ error: 'Platform not found' }, 404)
    }

    try {
        await detectAndCreateMatches(listing, platformRow.config)

        return c.json({ status: 'ok' })
    } catch (e) {
        await db.update(schema.listings)
            .set({
                matchingError: String(e),
            })
            .where(eq(schema.listings.id, listingId))

        return c.json({ status: 'error' }, 500)
    }
})