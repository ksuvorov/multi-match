import {useRouter} from 'next/navigation';

import {DashboardMatch} from '@/lib/db/queries/match';
import {intersection, toDTFromSQL} from '@/lib/date';
import Period from '@/app/components/Period';

import {Card} from '../../../../../Card';

export function MatchCard({ match }: { match: DashboardMatch }) {
    const router = useRouter();
    const { counterpart, myListing } = match;
    const period = intersection(
        [toDTFromSQL(counterpart.availableFrom), toDTFromSQL(counterpart.availableUntil)],
        [toDTFromSQL(myListing.availableFrom), toDTFromSQL(myListing.availableUntil)]
    );
    return (
        <div onClick={() => router.push(`/platform/dive/match/${match.match.id}`)}>
            <Card
                title={counterpart.title}
                description={counterpart.description}
                footer={
                    <>
                        {period && <Period interval={period} />}
                    </>
                }
            />
        </div>
    )
}