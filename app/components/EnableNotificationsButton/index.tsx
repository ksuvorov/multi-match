'use client';

import { usePushSubscription } from '@/lib/hooks/usePushSubscription';
import { usePlatformSession } from '@/app/providers/platformSession';

function BellIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}

function BellOffIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
            <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
            <path d="M18 8a6 6 0 0 0-9.33-5" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    )
}

export function EnableNotificationButton() {
    const { platformMembership } = usePlatformSession();
    const { subscribe, status } = usePushSubscription(platformMembership?.id);

    const isGranted = status === 'granted';
    const isLoading = status === 'loading';

    return (
        <button
            onClick={isGranted || isLoading ? undefined : subscribe}
            disabled={isLoading}
            aria-label={isGranted ? 'Notifications enabled' : 'Enable notifications'}
            title={isGranted ? 'Notifications enabled' : 'Enable notifications'}
            className={[
                'relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200',
                isGranted
                    ? 'bg-brand/10 text-brand cursor-default'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer',
                isLoading ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
        >
            {isGranted
                ? <BellIcon className="w-5 h-5" />
                : <BellOffIcon className="w-5 h-5" />
            }
            {!isGranted && !isLoading && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" aria-hidden="true" />
            )}
            <span className="sr-only">
                {isLoading ? 'Enabling notifications...' : isGranted ? 'Notifications enabled' : 'Enable notifications'}
            </span>
        </button>
    );
}
