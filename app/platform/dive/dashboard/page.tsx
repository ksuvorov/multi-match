import {redirect} from 'next/navigation';
import {headers} from 'next/headers';

import {getPlatformBootstrap} from '@/lib/db/queries/bootstrap';

import Header from './components/Header';
import Tabs from './components/Tabs';

export default async function DashboardPage() {
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')

    if (!platformSlug) redirect('/')

    const data = await getPlatformBootstrap(platformSlug!)

    if (!data?.platformMembership) redirect('/platform/dive');

    return (
        <div className="flex flex-col gap-3 h-screen">
            <Header
                platformId={data.platform.id}
                roles={data.platform.config.roles}
                activeRole={data.platformMembership.activeRole}
            />
            <Tabs membershipId={data.platformMembership.id} activeRole={data.platformMembership.activeRole!} />
        </div>
    )
}