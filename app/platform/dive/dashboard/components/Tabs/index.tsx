import {getMembershipListings} from '@/lib/db/queries/listing';
import {getMembershipMatches} from '@/lib/db/queries/match';

import Content from './components/Content';

type Props = {
    membershipId: string,
    activeRole: string,
}

export default async function Tabs({ membershipId, activeRole }: Props) {
    const [listings, matches] = await Promise.all([
        getMembershipListings(membershipId, activeRole),
        getMembershipMatches(membershipId, activeRole),
    ]);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <Content listings={listings} matches={matches} />
        </div>
    )
}