'use client';

import { usePushSubscription } from '@/lib/hooks/usePushSubscription';
import { usePlatformSession } from '@/app/providers/platformSession';

export function EnableNotificationButton() {
    const { platformMembership } = usePlatformSession();
    const { subscribe, status } = usePushSubscription(platformMembership?.id);

    if (status === 'granted') return null;

    return (
        <button onClick={subscribe} disabled={status === 'loading'}>
            {status === 'loading' ? 'Enabling...' : 'Enable notifications'}
        </button>
    );
}