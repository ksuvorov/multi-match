'use client'

import { createContext, useContext, PropsWithChildren } from 'react';
import type { InferSelectModel } from 'drizzle-orm';

import type { platform } from '@/lib/db/schemas/platform';

type Platform = InferSelectModel<typeof platform>

const PlatformContext = createContext<Platform | null>(null)

type Props = {
    platform: Platform,
}
export const PlatformProvider = ({ platform, children }: PropsWithChildren<Props>) =>
    <PlatformContext.Provider value={platform}>
        {children}
    </PlatformContext.Provider>

export function usePlatform() {
    const ctx = useContext(PlatformContext)
    if (!ctx) throw new Error('usePlatform must be used within PlatformProvider')
    return ctx
}