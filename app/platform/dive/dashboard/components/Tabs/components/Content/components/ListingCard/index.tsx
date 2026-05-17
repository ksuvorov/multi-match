import {useMemo} from 'react';

import {IntervalTuple, toDTFromDate} from '@/lib/date';
import {Listing} from '@/lib/db/schemas/listing';
import Period from '@/app/components/Period';

import {Card} from '../../../../../Card';

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}

export function ListingCard({ listing }: { listing: Listing }) {
    const period = useMemo<IntervalTuple>(
        () => [toDTFromDate(listing.availableFrom), toDTFromDate(listing.availableUntil)],
        [listing],
    );
    return (
        <Card
            title={listing.title}
            description={listing.description}
            footer={
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {period && <Period interval={period} />}
                </div>
            }
        />
    )
}