import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import * as schema from '@/lib/db/schema'
import db from '@/lib/db'

export const manifestRouter = new Hono()

manifestRouter.get('/', async (c) => {
    const slug = c.req.query('platform')

    const p = slug
        ? await db.query.platform.findFirst({ where: eq(schema.platform.slug, slug) })
        : null

    const manifest = {
        name: p?.config?.appName ?? 'App',
        short_name: p?.config?.appName ?? 'App',
        start_url: p ? `/platform/${slug}` : '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
    }

    return c.json(manifest, 200, {
        'Content-Type': 'application/manifest+json',
    })
})