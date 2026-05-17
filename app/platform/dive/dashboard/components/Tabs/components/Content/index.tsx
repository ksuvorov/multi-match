'use client'

import { useMemo, useState } from 'react'

import {DashboardMatch} from '@/lib/db/queries/match';
import {Listing} from '@/lib/db/schemas/listing';
import Switcher from '@/app/components/Switcher';

import {ListingCard} from './components/ListingCard';
import {MatchCard} from './components/MatchCard';
import Counter from './components/Counter';

type Tab = 'listings' | 'matches'

interface Props {
    listings: Listing[]
    matches:  DashboardMatch[]
}

export default function TabSwitcher({ listings, matches }: Props) {
    const [tab, setTab] = useState<Tab>('listings')

    const options = useMemo(() => [
        { id: 'listings', label: 'Listings', badge: <Counter count={listings.length} /> },
        { id: 'matches', label: 'Matches', badge: <Counter count={matches.length} /> },
    ], [listings.length, matches.length])
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <Switcher options={options} activeId={tab} onChange={(id) => setTab(id as Tab)} stretch />
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-2 py-2">
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

