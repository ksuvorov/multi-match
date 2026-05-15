'use client'

import { useState } from 'react'

import { DashboardMatch } from '@/lib/db/queries/match';
import { Listing } from '@/lib/db/schemas/listing';

import { ListingCard } from './components/ListingCard';
import { MatchCard } from './components/MatchCard';

type Tab = 'listings' | 'matches'

const TAB_LABELS: Record<Tab, string> = {
    listings: 'Listings',
    matches: 'Matches',
}

interface Props {
    listings: Listing[]
    matches: DashboardMatch[]
}

export default function TabSwitcher({ listings, matches }: Props) {
    const [tab, setTab] = useState<Tab>('listings')

    const counts: Record<Tab, number> = {
        listings: listings.length,
        matches: matches.length,
    }

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Tab bar */}
            <div
                role="tablist"
                aria-label="Dashboard sections"
                className="flex gap-1 mx-4 mb-4 bg-muted p-1 rounded-2xl shrink-0"
            >
                {(['listings', 'matches'] as Tab[]).map((t) => {
                    const active = tab === t
                    return (
                        <button
                            key={t}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(t)}
                            className={[
                                'flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-xl',
                                'text-sm font-semibold transition-all duration-200',
                                active
                                    ? 'bg-background text-foreground shadow-sm shadow-black/[0.06]'
                                    : 'text-muted-foreground hover:text-foreground',
                            ].join(' ')}
                        >
                            {TAB_LABELS[t]}
                            <span className={[
                                'inline-flex items-center justify-center min-w-[20px] h-5',
                                'px-1.5 text-[11px] font-bold rounded-full transition-all duration-200',
                                active
                                    ? 'bg-brand text-brand-foreground'
                                    : 'bg-border text-muted-foreground',
                            ].join(' ')}>
                                {counts[t]}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            <div
                role="tabpanel"
                className="flex flex-col flex-1 min-h-0 gap-3 px-4 pb-6 overflow-y-auto"
            >
                {tab === 'listings' && (
                    listings.length === 0
                        ? <EmptyState message="No listings yet" />
                        : listings.map((listing) =>
                            <ListingCard key={listing.id} listing={listing} />
                        )
                )}
                {tab === 'matches' && (
                    matches.length === 0
                        ? <EmptyState message="No matches yet" />
                        : matches.map((match) =>
                            <MatchCard key={match.match.id} match={match} />
                        )
                )}
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-muted-foreground" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
    )
}

