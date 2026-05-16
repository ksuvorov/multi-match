import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { eq } from 'drizzle-orm'

import {PlatformProvider} from '@/app/providers/platform';
import { platform } from '@/lib/db/schemas/platform';
import db from '@/lib/db';

import './dive.css'

export default async function DiveLayout({ children }: { children: ReactNode }) {
    const p = await db.query.platform.findFirst({
        where: eq(platform.slug, 'dive')
    })

    if (!p) notFound();

    return (
        <PlatformProvider platform={p}>
            <div className="platform-dive h-full">
                {children}
            </div>
        </PlatformProvider>
    )
}