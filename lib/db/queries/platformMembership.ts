import { and, eq } from 'drizzle-orm';

import * as schema from '@/lib/db/schema';
import db from '@/lib/db';

export async function getPlatformMembership(platformId: string, userId: string) {
    return db.query.platformMembership.findFirst({
        where: and(
            eq(schema.platformMembership.userId, userId),
            eq(schema.platformMembership.platformId, platformId),
        ),
    })
}