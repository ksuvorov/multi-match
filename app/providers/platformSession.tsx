'use client'

import { createContext, useContext } from 'react'

import { PlatformMembership } from '@/lib/db/schemas/platformMembership'
import { Platform } from '@/lib/db/schemas/platform'
import { User } from '@/lib/auth/schema'

type PlatformSession = {
    user: User
    platform: Platform
    platformMembership: PlatformMembership | null
}

const PlatformSessionContext = createContext<PlatformSession | null>(null)

export function PlatformSessionProvider({
    value,
    children,
}: {
    value: PlatformSession
    children: React.ReactNode
}) {
    return (
        <PlatformSessionContext.Provider value={value}>
            {children}
        </PlatformSessionContext.Provider>
    )
}

export function usePlatformSession() {
    const ctx = useContext(PlatformSessionContext)
    if (!ctx) throw new Error('usePlatformSession must be used within provider')
    return ctx
}