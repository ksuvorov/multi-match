import {DateTime} from 'luxon';

import {DashboardMatch} from '@/lib/db/queries/match';
import Period from '@/app/components/Period';
import {intersection} from '@/lib/date';

import {Card} from '../../../../../Card';

const toDT = (value: string | null) =>
    value ? DateTime.fromSQL(value, { zone: "utc" }) : null;

export function MatchCard({ match }: { match: DashboardMatch }) {
    const { counterpart, myListing } = match;
    const period = intersection(
        [toDT(counterpart.availableFrom), toDT(counterpart.availableUntil)],
        [toDT(myListing.availableFrom), toDT(myListing.availableUntil)]
    );
    return (
        <Card
            title={counterpart.title}
            description={counterpart.description}
            footer={
                <>
                    {period && <Period interval={period} />}
                </>
            }
        />
    )
}