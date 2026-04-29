'use client';

import { usePushSubscription } from '@/lib/hooks/usePushSubscription';
import { usePlatformSession } from '@/app/providers/platformSession';

export function PushInit() {
    const { platformMembership } = usePlatformSession();
    usePushSubscription(platformMembership?.id);
    return null;
}