import { waitUntil } from '@vercel/functions'
import { eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';

import {buildListingSchema, splitListingFields} from '@/lib/db/schemas/validators/listing';
import {ensureMembership} from '@/lib/db/queries/membership';
import * as schema from '@/lib/db/schema';
import {baseUrl} from '@/lib/baseUrl';
import db from '@/lib/db';

import {requireAuth} from '../middlewares/auth';

export const listingsRouter = new Hono();

listingsRouter.post('/', requireAuth, async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json()

    const { platformId, fields, role } = body
    if (!platformId || !fields) return c.json({ error: 'Missing required fields' }, 400)

    const p = await db.query.platform.findFirst({
        where: eq(schema.platform.id, platformId)
    })
    if (!p) return c.json({ error: 'Platform not found' }, 404)

    const fieldSchema = p.listingSchemas[role].flatMap(s => s.fields)

    const zodSchema = buildListingSchema(fieldSchema)
    const result    = zodSchema.safeParse(fields)

    if (!result.success) {
        return c.json({ errors: result.error.flatten().fieldErrors }, 400)
    }

    const { columns, meta } = splitListingFields(fields, fieldSchema);

    const membership = await ensureMembership(platformId, userId, role);
    const locationRaw = columns.location as { lat: number; lng: number } | undefined

    const [listing] = await db
        .insert(schema.listings)
        .values({
            platformId,
            membershipId:   membership.id,
            role,
            status:         'active',
            meta,
            title:          (columns.title as string)       ?? null,
            description:    (columns.description as string) ?? null,
            location:       locationRaw
                ? sql`ST_GeomFromGeoJSON(${JSON.stringify({
                    type: 'Point',
                    coordinates: [locationRaw.lng, locationRaw.lat],
                })})`
                : null,
            searchRadiusKm: (columns.searchRadiusKm as number) ?? null,
            availableFrom:  columns.availableFrom  ? new Date(columns.availableFrom as string)  : null,
            availableUntil: columns.availableUntil ? new Date(columns.availableUntil as string) : null,
        })
        .returning()

    waitUntil(
        fetch(`${baseUrl}/api/internal/matching/listing`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
            },
            body: JSON.stringify({ listingId: listing.id }),
        })
    )

    return c.json(listing, 201)
})