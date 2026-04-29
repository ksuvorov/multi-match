'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { EnableNotificationButton } from '@/app/components/EnableNotificationsButton';
import { usePlatformSession } from '@/app/providers/platformSession'
import { switchRole } from '@/app/actions/switchRole'
import {Platform} from '@/lib/db/schemas/platform';

const ROLE_LABELS: Record<string, string> = {
    provider: 'Provider',
    seeker: 'Seeker',
}

type Props = {
    platformId: Platform['id'];
    roles: string[];
    activeRole: string | null;
}

export default function DashboardHeader({roles, activeRole}: Props) {
    const { platform } = usePlatformSession()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSwitch = (role: string) => {
        if (role === activeRole || isPending) return
        startTransition(async () => {
            await switchRole(platform.id, role)
            router.refresh()
        })
    }

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => handleSwitch(role)}
                        disabled={isPending}
                        className={[
                            'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                            role === activeRole
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                            isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                        ].join(' ')}
                    >
                        {ROLE_LABELS[role] ?? role}
                    </button>
                ))}
            </div>
            <div>
                <EnableNotificationButton />
            </div>
        </header>
    )
}