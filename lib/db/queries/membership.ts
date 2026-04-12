import { eq, and } from 'drizzle-orm';

import * as schema from '../schema';
import db from '..';

export async function ensureMembership(platformId: string, userId: string, role: string) {
    const existing = await db.query.platformMembership.findFirst({
        where: and(
            eq(schema.platformMembership.platformId, platformId),
            eq(schema.platformMembership.userId, userId)
        )
    })

    if (!existing) {
        const [created] = await db
            .insert(schema.platformMembership)
            .values({ platformId, userId, roles: [role] })
            .returning()
        return created
    }

    if (existing.roles.includes(role)) return existing

    const [updated] = await db
        .update(schema.platformMembership)
        .set({ roles: [...existing.roles, role] })
        .where(eq(schema.platformMembership.id, existing.id))
        .returning();

    return updated
}