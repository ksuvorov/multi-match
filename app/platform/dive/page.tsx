import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { getPlatformBootstrap } from '@/lib/db/queries/bootstrap';
import ActionCard from '@/app/components/ActionCard';

const MAP: Record<string, { title: string; subtitle: string; icon: string }> = {
    provider: {
        icon: '🤿',
        title: "I'm a diver",
        subtitle: 'Looking for my next dive',
    },
    seeker: {
        icon: '🔍',
        title: 'I need a diver',
        subtitle: 'Got something to be done underwater',
    },
}

export default async function DiveLanding() {
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')!

    const data = await getPlatformBootstrap(platformSlug)
    if (data?.platformMembership) {
        redirect('/platform/dive/dashboard')
    }

    const roles = data?.platform.config.roles ?? []
    return (
        <div className="relative h-full w-full flex flex-col overflow-hidden">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 70% 45% at 50% 28%, var(--brand-muted) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 flex flex-col flex-1 gap-4 text-center p-6">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand opacity-60">
                    Welcome
                </p>

                <div className="flex flex-col gap-1.5">
                    <p className="text-[28px] font-extrabold tracking-tight leading-tight text-fg">
                        Let&apos;s get<br />started
                    </p>
                    <p className="text-sm text-fg-muted">
                        What brings you here?
                    </p>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    {roles.map((role) => (
                        <ActionCard
                            key={role}
                            href={`/platform/${platformSlug}/${role}`}
                            icon={MAP[role]?.icon}
                            title={MAP[role]?.title ?? role}
                            subtitle={MAP[role]?.subtitle}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}