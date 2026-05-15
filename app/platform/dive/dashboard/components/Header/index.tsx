'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { EnableNotificationButton } from '@/app/components/EnableNotificationsButton';
import { usePlatformSession } from '@/app/providers/platformSession'
import { switchRole } from '@/app/actions/switchRole'
import { Platform } from '@/lib/db/schemas/platform';

const ROLE_LABELS: Record<string, string> = {
    provider: 'Diver',
    seeker: 'Seeker',
}

const ROLE_ICONS: Record<string, string> = {
    provider: '🤿',
    seeker: '🔍',
}

type Props = {
    platformId: Platform['id'];
    roles: string[];
    activeRole: string | null;
}

export default function DashboardHeader({ roles, activeRole }: Props) {
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
        <header className="flex items-center justify-between px-4 pt-5 pb-4 bg-background">
            {/* Role switcher pill */}
            <div className="flex gap-1 bg-muted p-1 rounded-2xl shadow-sm">
                {roles.map((role) => {
                    const active = role === activeRole
                    return (
                        <button
                            key={role}
                            onClick={() => handleSwitch(role)}
                            disabled={isPending}
                            aria-pressed={active}
                            className={[
                                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                                active
                                    ? 'bg-brand text-brand-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground',
                                isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            <span aria-hidden="true">{ROLE_ICONS[role] ?? ''}</span>
                            {ROLE_LABELS[role] ?? role}
                        </button>
                    )
                })}
            </div>

            {/* Notification bell */}
            <EnableNotificationButton />
        </header>
    )
}
