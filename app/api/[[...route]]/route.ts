import { handle } from 'hono/vercel';
import { Hono } from 'hono';

import {listingsRouter} from './routers/listings';
import {manifestRouter} from './routers/manifest';

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/health', (c) => c.json({ ok: true }))
app.route('/listings', listingsRouter);
app.route('/manifest', manifestRouter);

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)