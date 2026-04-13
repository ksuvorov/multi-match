import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

import {buildListingSchema, listingTypeSchema, splitListingFields} from '@/lib/db/schemas/validators/listing';
import {ensureMembership} from '@/lib/db/queries/membership';
import * as schema from '@/lib/db/schema';
import db from '@/lib/db';

import {requireAuth} from '../middlewares/auth';

export const listingsRouter = new Hono();

listingsRouter.post('/', requireAuth, async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json()

    const parsedType = listingTypeSchema.safeParse(body.listingType)
    if (!parsedType.success) return c.json({ error: 'Invalid listing type' }, 400)
    const listingType = parsedType.data

    const { platformId, fields } = body
    if (!platformId || !fields) return c.json({ error: 'Missing required fields' }, 400)

    const p = await db.query.platform.findFirst({
        where: eq(schema.platform.id, platformId)
    })
    if (!p) return c.json({ error: 'Platform not found' }, 404)

    const fieldSchema = p.listingSchemas[listingType]

    const zodSchema = buildListingSchema(fieldSchema)
    const result    = zodSchema.safeParse(fields)

    if (!result.success) {
        return c.json({ errors: result.error.flatten().fieldErrors }, 400)
    }

    const { columns, meta } = splitListingFields(fields, fieldSchema);

    const role = listingType === 'offer' ? 'provider' : 'seeker'
    const membership = await ensureMembership(platformId, userId, role);

    const [listing] = await db
        .insert(schema.listings)
        .values({
            platformId,
            membershipId:   membership.id,
            listingType,
            status:         'active',
            schemaVersion:  p.schemaVersion,
            meta,
            title:          (columns.title as string)       ?? null,
            description:    (columns.description as string) ?? null,
            geoType:        columns.locationPoint ? 'point' : 'none',
            locationPoint:  (columns.locationPoint ?? null) as { lat: number; lng: number } | null,
            searchRadiusKm: (columns.searchRadiusKm as number) ?? null,
            availableFrom:  columns.availableFrom  ? new Date(columns.availableFrom as string)  : null,
            availableUntil: columns.availableUntil ? new Date(columns.availableUntil as string) : null,
        })
        .returning()

    return c.json(listing, 201)
})