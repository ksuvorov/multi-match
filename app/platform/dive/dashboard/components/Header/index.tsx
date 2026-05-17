'use client'

import { ReactNode, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { EnableNotificationButton } from '@/app/components/EnableNotificationsButton';
import { usePlatformSession } from '@/app/providers/platformSession'
import { switchRole } from '@/app/actions/switchRole'
import {Platform} from '@/lib/db/schemas/platform';
import Switcher from '@/app/components/Switcher';
import Button from '@/app/components/Button';

const ROLE_LABELS: Record<string, {label: string, icon?: ReactNode}> = {
    provider: {label: 'Provider', icon: '🤿'},
    seeker: {label: 'Seeker', icon: '🔍'},
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

    const options = useMemo(
        () => roles.map((role) => ({
            id: role,
            label: ROLE_LABELS[role].label ?? role,
            icon: ROLE_LABELS[role].icon,
        })),
        [roles]
    )

    return (
        <header className="flex items-center justify-between">
            <Switcher options={options} activeId={activeRole} onChange={handleSwitch} />
            <div className="flex gap-2">
                <EnableNotificationButton />
                <Button href={`/platform/dive/${activeRole}`}>+</Button>
            </div>
        </header>
    )
}