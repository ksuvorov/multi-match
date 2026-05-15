import { DateTime } from 'luxon';

import { DashboardMatch } from '@/lib/db/queries/match';
import Period from '@/app/components/Period';
import { intersection } from '@/lib/date';

import { Card } from '../../../../../Card';

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
            tags={
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Match
                </span>
            }
            title={counterpart.title}
            description={counterpart.description}
            footer={
                period ? (
                    <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <Period interval={period} />
                    </span>
                ) : undefined
            }
        />
    )
}
