import webpush, {WebPushError} from 'web-push';
import { inArray } from 'drizzle-orm';

import {pushSubscription} from '@/lib/db/schemas/pushSubscription';
import db from '@/lib/db';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
);

export async function sendPushToMemberships(
    membershipIds: string[],
    payload: { title: string; body: string; url?: string },
) {
    console.log('sendPushToMemberships', { membershipIds, payload })

    if (!membershipIds.length) return;

    const subs = await db
        .select()
        .from(pushSubscription)
        .where(inArray(pushSubscription.membershipId, membershipIds));

    console.log('subs found:', subs.length)

    if (!subs.length) return;

    const dead: string[] = [];

    await Promise.allSettled(
        subs.map(async (sub) => {
            try {
                await webpush.sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    JSON.stringify(payload),
                );
            } catch (err) {
                const e = err as WebPushError;
                if (e.statusCode === 410 || e.statusCode === 404) {
                    dead.push(sub.endpoint);
                }
            }
        }),
    );

    if (dead.length) {
        await db
            .delete(pushSubscription)
            .where(inArray(pushSubscription.endpoint, dead));
    }
}