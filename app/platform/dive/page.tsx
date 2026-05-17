import {headers} from 'next/headers';
import Link from 'next/link';

import {getPlatformBootstrap} from '@/lib/db/queries/bootstrap';
import Button from '@/app/components/button';

const MAP: Record<string, { title: string; subtitle: string }> = {
    provider: {
        title: 'I’m a diver',
        subtitle: 'Looking for my next dive',
    },
    seeker: {
        title: 'I need a diver',
        subtitle: 'Got something to be done underwater',
    }
}

export default async function DiveLanding() {
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')!
    const data = await getPlatformBootstrap(platformSlug)
    const roles = data?.platform.config.roles ?? []
    return (
        <div className="h-full w-full flex flex-col gap-6 text-center p-6">
            <p className="text-2xl font-semibold">Let’s get started</p>
            <p className="text-muted-foreground">What brings you here?</p>
            <div className="flex-1 flex flex-col gap-4">
                {roles.map((role) => (
                    <Link key={role} href={`/platform/${platformSlug}/${role}`} className="flex flex-col flex-1">
                        <Button
                            title={MAP[role].title}
                            subtitle={MAP[role].subtitle}
                            className="flex-1 w-full flex flex-col items-center justify-center rounded-lg"
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}