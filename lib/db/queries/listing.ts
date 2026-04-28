import {and, eq} from 'drizzle-orm';

import {listings} from '@/lib/db/schemas/listing';
import db from '@/lib/db';

export async function getMembershipListings(membershipId: string, role: string) {
    return db
        .select()
        .from(listings)
        .where(and(
            eq(listings.membershipId, membershipId),
            eq(listings.role, role),
        ))
        .orderBy(listings.createdAt)
}