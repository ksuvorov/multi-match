import { and, eq } from 'drizzle-orm'
import {headers} from 'next/headers';
import { cache } from 'react'

import { platformMembership } from '@/lib/db/schemas/platformMembership'
import { platform } from '@/lib/db/schemas/platform'
import { auth } from '@/lib/auth/server'
import { User } from '@/lib/auth/schema'
import db from '@/lib/db'

export const getPlatformBootstrap = cache(async (platformSlug: string) => {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h })

    const platformRow = await db.query.platform.findFirst({
        where: eq(platform.slug, platformSlug),
    })

    if (!platformRow) {
        return null;
    }

    const membership = session && await db.query.platformMembership.findFirst({
        where: and(
            eq(platformMembership.userId, session.user.id),
            eq(platformMembership.platformId, platformRow.id)
        ),
    })

    return {
        user: session?.user as User,
        platform: platformRow,
        platformMembership: membership ?? null,
    }
});