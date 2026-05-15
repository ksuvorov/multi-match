'use client'

import { useState } from 'react'

import {DashboardMatch} from '@/lib/db/queries/match';
import {Listing} from '@/lib/db/schemas/listing';

import {ListingCard} from './components/ListingCard';
import {MatchCard} from './components/MatchCard';

type Tab = 'listings' | 'matches'

interface Props {
    listings: Listing[]
    matches:  DashboardMatch[]
}

export default function TabSwitcher({ listings, matches }: Props) {
    const [tab, setTab] = useState<Tab>('listings')

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="relative grid grid-cols-2 border-b border-border bg-background shrink-0">
                {(['listings', 'matches'] as Tab[]).map((t) => {
                    const count = t === 'listings' ? listings.length : matches.length
                    const active = tab === t
                    return (
                        <button
                            key={t}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(t)}
                            className={[
                                'relative z-10 flex items-center justify-center gap-1.5 p-4',
                                'text-sm font-medium transition-colors',
                                active ? 'text-foreground' : 'text-muted-foreground',
                            ].join(' ')}
                        >
                            <span className="capitalize">{t}</span>
                            <span className={[
                                'inline-flex items-center justify-center min-w-[18px] h-[18px]',
                                'px-1.5 text-[11px] font-semibold rounded-full transition-colors',
                                active
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted text-muted-foreground',
                            ].join(' ')}>
                                {count}
                            </span>
                        </button>
                    )
                })}
                <div
                    className="absolute bottom-[-1px] left-0 w-1/2 h-0.5 bg-foreground rounded-t transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ transform: `translateX(${tab === 'listings' ? '0%' : '100%'})` }}
                />
            </div>

            <div className="flex flex-col flex-1 min-h-0">
                {tab === 'listings' && (
                    listings.map((listing) =>
                        <ListingCard key={listing.id} listing={listing} />
                    )
                )}
                {tab === 'matches' && (
                    matches.map((match) =>
                        <MatchCard key={match.match.id} match={match} />
                    )
                )}
            </div>
        </div>
    )
}

