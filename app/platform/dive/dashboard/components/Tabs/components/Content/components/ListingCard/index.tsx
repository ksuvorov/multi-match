import { format } from "date-fns";

import { Listing } from '@/lib/db/schemas/listing';

import { Card } from '../../../../../Card';

const STATUS_STYLES: Record<string, string> = {
    active:   'bg-brand/10 text-brand',
    pending:  'bg-amber-50 text-amber-600',
    closed:   'bg-muted text-muted-foreground',
}

export function ListingCard({ listing }: { listing: Listing }) {
    const statusClass = STATUS_STYLES[listing.status] ?? STATUS_STYLES.closed

    return (
        <Card
            tags={
                <span
                    className={[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
                        statusClass,
                    ].join(' ')}
                >
                    {listing.status}
                </span>
            }
            title={listing.title}
            description={listing.description}
            footer={
                <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {format(new Date(listing.createdAt), "MMM d, yyyy")}
                </span>
            }
        />
    )
}
