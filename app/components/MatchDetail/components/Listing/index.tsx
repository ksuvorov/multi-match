import { useMemo } from 'react'

import { MatchListingData } from '@/lib/db/queries/match'
import { IntervalTuple, toDTFromSQL } from '@/lib/date'
import Period from '@/app/components/Period'

type MatchStatus = 'pending' | 'sent' | 'confirmed' | 'rejected'

type Props = {
    listing:    MatchListingData
    isApproved: boolean
    isRejected: boolean
    color:      string
}

const statusLabel: Record<MatchStatus, string> = {
    pending:   '● Pending',
    sent:      '✓ Sent',
    confirmed: '✓ Confirmed',
    rejected:  '✕ Rejected',
}

const statusClass: Record<MatchStatus, string> = {
    pending:   'bg-brand-subtle  text-fg-muted  border-border',
    sent:      'bg-brand-muted   text-brand     border-brand/25',
    confirmed: 'bg-success-muted text-success   border-success/25',
    rejected:  'bg-danger-muted  text-danger    border-danger/20',
}

function resolveStatus({ isApproved, isRejected }: Pick<Props, 'isApproved' | 'isRejected'>): MatchStatus {
    if (isRejected) return 'rejected'
    if (isApproved) return 'sent'
    return 'pending'
}

export default function Listing({ listing, color, isApproved, isRejected }: Props) {
    const period = useMemo<IntervalTuple>(
        () => [toDTFromSQL(listing.availableFrom), toDTFromSQL(listing.availableUntil)],
        [listing],
    )

    const status = resolveStatus({ isApproved, isRejected })

    return (
        <div className="flex-1 p-3 bg-white/[0.04] border border-border rounded-md">
            <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="font-sans font-bold text-[13px] text-fg truncate">
                    {listing.title}
                </span>
            </div>

            <div className="font-mono text-[9px] text-fg-muted">
                <Period interval={period} />
            </div>

            <span className={`
                inline-flex items-center mt-1
                font-mono text-[8px] tracking-[0.06em]
                px-2 py-0.5 rounded-full border
                ${statusClass[status]}
            `}>
                {statusLabel[status]}
            </span>
        </div>
    )
}