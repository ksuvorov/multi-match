import { handle } from 'hono/vercel';
import { Hono } from 'hono';

const app = new Hono().basePath('/api')

app.get('/health', (c) => c.json({ ok: true }))
app.get('/date', (c) => c.json({ date: Date.now() }))

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)