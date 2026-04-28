'use server'

import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'

import { platformMembership } from '@/lib/db/schemas/platformMembership'
import { auth } from '@/lib/auth/server'
import db from '@/lib/db'

export async function switchRole(platformId: string, role: string) {
    if (!role) throw new Error('Invalid role')

    const h = await headers()
    const session = await auth.api.getSession({ headers: new Headers(h) })

    if (!session?.user) throw new Error('Unauthorized')

    await db
        .update(platformMembership)
        .set({ activeRole: role })
        .where(
            and(
                eq(platformMembership.userId, session.user.id),
                eq(platformMembership.platformId, platformId)
            )
        )
}