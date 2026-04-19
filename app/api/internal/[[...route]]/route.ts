import { handle } from 'hono/vercel'
import { Hono } from 'hono'

import { matchingRouter } from './routers/matching'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api/internal')

app.get('/health', (c) => c.json({ ok: true }))
app.route('/matching', matchingRouter)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)