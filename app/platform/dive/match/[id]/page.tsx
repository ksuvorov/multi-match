import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { getPlatformBootstrap } from '@/lib/db/queries/bootstrap';
import { MatchDetail } from '@/app/components/MatchDetail';
import { getMatchDetail } from '@/lib/db/queries/match';

type Params = { id: string };
type Props = { params: Promise<Params> }
export default async function MatchPage({ params }: Props) {
    const { id } = await params
    const h = await headers()
    const platformSlug = h.get('x-platform-slug')
    const bootstrap = await getPlatformBootstrap(platformSlug!)
    if (!bootstrap?.platformMembership) redirect('/platform/dive');

    const match = await getMatchDetail(id, bootstrap.platformMembership.id)
    if (!match) notFound()

    return <MatchDetail match={match} />
}