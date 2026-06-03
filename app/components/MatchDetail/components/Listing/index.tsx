import { CircleDashed, CircleCheck, CircleX } from 'lucide-react';
import { useMemo } from 'react';

import { MatchListingData } from '@/lib/db/queries/match';
import { IntervalTuple, toDTFromSQL } from '@/lib/date';
import Period from '@/app/components/Period';

type Props = {
    listing: MatchListingData,
    isApproved: boolean;
    isRejected: boolean;
    color: string;
}

export default function Listing({listing, color, isApproved, isRejected}: Props) {
    const period = useMemo<IntervalTuple>(
        () => [toDTFromSQL(listing.availableFrom), toDTFromSQL(listing.availableUntil)],
        [listing],
    );
    return (
        <div>
            <div style={{color}} className="flex gap-2">
                {isRejected ? <CircleX /> : isApproved ? <CircleCheck /> : <CircleDashed />}
                {listing.title}
            </div>
            {period && <Period interval={period} />}
            {listing.description && <div className="line-clamp-3">{listing.description}</div>}
        </div>
    )
}