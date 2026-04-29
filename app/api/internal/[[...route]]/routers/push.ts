import { eq, and } from 'drizzle-orm'
import { Hono } from 'hono'

import { platformMembership } from '@/lib/db/schemas/platformMembership'
import { pushSubscription } from '@/lib/db/schemas/pushSubscription'
import { auth } from '@/lib/auth/server'
import db from '@/lib/db'

export const pushRouter = new Hono()

pushRouter.post('/subscribe', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    const { endpoint, keys, membershipId } = await c.req.json()

    const membership = await db.query.platformMembership.findFirst({
        where: and(
            eq(platformMembership.id, membershipId),
            eq(platformMembership.userId, session.user.id),
        ),
    })

    if (!membership) return c.json({ error: 'Forbidden' }, 403)

    await db
        .insert(pushSubscription)
        .values({ membershipId, endpoint, p256dh: keys.p256dh, auth: keys.auth })
        .onConflictDoNothing()

    return c.json({ ok: true })
})