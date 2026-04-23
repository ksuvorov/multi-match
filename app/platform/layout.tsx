import {redirect} from 'next/navigation';
import {PropsWithChildren} from 'react';
import { headers } from 'next/headers'

import {PlatformSessionProvider} from '@/app/providers/platformSession';
import {getPlatformBootstrap} from '@/lib/db/queries/bootstrap';

export default async function PlatformLayout({ children }: PropsWithChildren) {
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')

    if (!platformSlug) {
        redirect('/')
    }

    const data = await getPlatformBootstrap(platformSlug)

    if (!data) {
        redirect('/')
    }

    return (
        <PlatformSessionProvider value={data}>
            {children}
        </PlatformSessionProvider>
    )
}