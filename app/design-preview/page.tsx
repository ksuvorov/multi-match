'use client'

import { useState } from 'react'

// ============================================================
// DESIGN PREVIEW — Mobile Dashboard Concept
// iOS-inspired, minimal, monochrome + ocean-blue accent
// ============================================================

type Role = 'diver' | 'seeker'
type Tab = 'listings' | 'matches'

const MOCK_LISTINGS = [
    { id: 1, title: 'Underwater Photography Session', description: 'Looking for experienced divers for a coral reef documentary shoot in the Red Sea.', status: 'active', date: 'May 12, 2026' },
    { id: 2, title: 'Hull Inspection — Marina Bay', description: 'Certified commercial diver needed for yacht hull inspection and cleaning.', status: 'pending', date: 'May 10, 2026' },
    { id: 3, title: 'Research Dive Assistant', description: 'Marine biology research team seeking dive buddy for sample collection.', status: 'closed', date: 'May 5, 2026' },
]

const MOCK_MATCHES = [
    { id: 1, title: 'Salvage Operation — Lake Geneva', description: 'Match with experienced salvage team. Overlapping availability confirmed.', period: 'Jun 1 — Jun 15' },
    { id: 2, title: 'Film Production Dive', description: 'Documentary crew matched. Safety diver role available.', period: 'Jul 10 — Jul 20' },
]

// ============================================================
// Icons (inline SVG)
// ============================================================

function BellIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}

function BellOffIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
            <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
            <path d="M18 8a6 6 0 0 0-9.33-5" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    )
}

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

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

// ============================================================
// Components
// ============================================================

function RoleSwitcher({ role, onRoleChange }: { role: Role; onRoleChange: (r: Role) => void }) {
    return (
        <div className="flex gap-1 bg-[#f2f2f7] p-1 rounded-2xl">
            {(['diver', 'seeker'] as Role[]).map((r) => {
                const active = r === role
                return (
                    <button
                        key={r}
                        onClick={() => onRoleChange(r)}
                        className={[
                            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                            active
                                ? 'bg-[#0a84ff] text-white shadow-md'
                                : 'text-[#8e8e93] hover:text-[#1c1c1e]',
                        ].join(' ')}
                    >
                        <span>{r === 'diver' ? '🤿' : '🔍'}</span>
                        {r === 'diver' ? 'Diver' : 'Seeker'}
                    </button>
                )
            })}
        </div>
    )
}

function NotificationButton({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={[
                'relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200',
                enabled
                    ? 'bg-[#0a84ff]/10 text-[#0a84ff]'
                    : 'bg-[#f2f2f7] text-[#8e8e93] hover:text-[#1c1c1e]',
            ].join(' ')}
        >
            {enabled ? <BellIcon className="w-5 h-5" /> : <BellOffIcon className="w-5 h-5" />}
            {!enabled && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0a84ff] rounded-full" />
            )}
        </button>
    )
}

function TabBar({ tab, onTabChange, counts }: { tab: Tab; onTabChange: (t: Tab) => void; counts: Record<Tab, number> }) {
    return (
        <div className="flex gap-1 mx-4 mb-4 bg-[#f2f2f7] p-1 rounded-2xl">
            {(['listings', 'matches'] as Tab[]).map((t) => {
                const active = tab === t
                return (
                    <button
                        key={t}
                        onClick={() => onTabChange(t)}
                        className={[
                            'flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-xl',
                            'text-sm font-semibold transition-all duration-200',
                            active
                                ? 'bg-white text-[#1c1c1e] shadow-sm'
                                : 'text-[#8e8e93] hover:text-[#1c1c1e]',
                        ].join(' ')}
                    >
                        {t === 'listings' ? 'Listings' : 'Matches'}
                        <span className={[
                            'inline-flex items-center justify-center min-w-[20px] h-5',
                            'px-1.5 text-[11px] font-bold rounded-full transition-all duration-200',
                            active
                                ? 'bg-[#0a84ff] text-white'
                                : 'bg-[#d1d1d6] text-[#8e8e93]',
                        ].join(' ')}>
                            {counts[t]}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={[
            'rounded-2xl border border-[#e5e5ea]/50 bg-white px-4 py-4',
            'shadow-sm shadow-black/[0.04]',
            'transition-all duration-200 hover:border-[#e5e5ea] hover:shadow-md hover:shadow-black/[0.07]',
            'active:scale-[0.99]',
            className,
        ].join(' ')}>
            {children}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'bg-[#0a84ff]/10 text-[#0a84ff]',
        pending: 'bg-amber-50 text-amber-600',
        closed: 'bg-[#f2f2f7] text-[#8e8e93]',
    }
    return (
        <span className={[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
            styles[status] ?? styles.closed,
        ].join(' ')}>
            {status}
        </span>
    )
}

function MatchBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff]">
            <CheckCircleIcon className="w-3 h-3" />
            Match
        </span>
    )
}

function ListingCard({ listing }: { listing: typeof MOCK_LISTINGS[0] }) {
    return (
        <Card>
            <div className="mb-2.5">
                <StatusBadge status={listing.status} />
            </div>
            <p className="mb-1 text-[15px] font-semibold leading-snug text-[#1c1c1e] text-balance">
                {listing.title}
            </p>
            <p className="mb-3 text-sm leading-relaxed text-[#8e8e93] line-clamp-2">
                {listing.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] border-t border-[#e5e5ea]/40 pt-3">
                <CalendarIcon className="w-3.5 h-3.5" />
                {listing.date}
            </div>
        </Card>
    )
}

function MatchCard({ match }: { match: typeof MOCK_MATCHES[0] }) {
    return (
        <Card>
            <div className="mb-2.5">
                <MatchBadge />
            </div>
            <p className="mb-1 text-[15px] font-semibold leading-snug text-[#1c1c1e] text-balance">
                {match.title}
            </p>
            <p className="mb-3 text-sm leading-relaxed text-[#8e8e93] line-clamp-2">
                {match.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] border-t border-[#e5e5ea]/40 pt-3">
                <ClockIcon className="w-3.5 h-3.5" />
                {match.period}
            </div>
        </Card>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f2f7] flex items-center justify-center">
                <SearchIcon className="w-6 h-6 text-[#8e8e93]" />
            </div>
            <p className="text-sm font-medium text-[#8e8e93]">{message}</p>
        </div>
    )
}

// ============================================================
// Main Preview
// ============================================================

export default function DesignPreviewPage() {
    const [role, setRole] = useState<Role>('diver')
    const [tab, setTab] = useState<Tab>('listings')
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)

    const counts: Record<Tab, number> = {
        listings: MOCK_LISTINGS.length,
        matches: MOCK_MATCHES.length,
    }

    return (
        <div className="min-h-dvh bg-[#f8f8f8]">
            {/* Phone frame */}
            <div className="max-w-md mx-auto bg-[#fafafa] min-h-dvh flex flex-col shadow-2xl shadow-black/10">
                
                {/* Header */}
                <header className="flex items-center justify-between px-4 pt-5 pb-4">
                    <RoleSwitcher role={role} onRoleChange={setRole} />
                    <NotificationButton
                        enabled={notificationsEnabled}
                        onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                </header>

                {/* Tab bar */}
                <TabBar tab={tab} onTabChange={setTab} counts={counts} />

                {/* Content */}
                <div className="flex flex-col flex-1 gap-3 px-4 pb-6 overflow-y-auto">
                    {tab === 'listings' && (
                        MOCK_LISTINGS.length === 0
                            ? <EmptyState message="No listings yet" />
                            : MOCK_LISTINGS.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))
                    )}
                    {tab === 'matches' && (
                        MOCK_MATCHES.length === 0
                            ? <EmptyState message="No matches yet" />
                            : MOCK_MATCHES.map((match) => (
                                <MatchCard key={match.id} match={match} />
                            ))
                    )}
                </div>

            </div>
        </div>
    )
}
