'use client';

import { usePushSubscription } from '@/lib/hooks/usePushSubscription';
import { usePlatformSession } from '@/app/providers/platformSession';
import Button from '@/app/components/Button';
import { isStandalone } from '@/lib/pwa';

export function EnableNotificationButton() {
    const { platformMembership } = usePlatformSession();
    const { subscribe, status } = usePushSubscription(platformMembership?.id);

    if (
        !isStandalone() ||
        status === 'granted' || status === 'denied'
    ) return null;

    return (
        <Button
            onClick={subscribe}
            disabled={status === 'loading'}
            className="relative"
            variant="secondary"
        >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0a84ff] rounded-full" />
        </Button>
    );
}

function BellIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}