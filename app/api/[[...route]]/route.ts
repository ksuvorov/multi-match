import { handle } from 'hono/vercel';
import { sql } from 'drizzle-orm';
import { Hono } from 'hono';

import db from '@/lib/db';

import {listingsRouter} from './routers/listings';

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/health', (c) => c.json({ ok: true }))
app.get('/date', (c) => c.json({ date: Date.now() }))
app.get('/date_db', async (c) => {
    const result = await db.execute(sql`SELECT NOW() as current_time`)
    return c.json({ date: result.rows[0].current_time });
})

app.route('/listings', listingsRouter);

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)