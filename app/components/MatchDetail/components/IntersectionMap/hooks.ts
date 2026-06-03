'use client'

import { useMemo } from 'react';

import { type MatchListingData } from '@/lib/db/queries/match';

import { getBounds, makeCircle } from './helpers';

export const useEnhance = (primary: MatchListingData, secondary: MatchListingData) => {
    const { primaryColor, secondaryColor } = useMemo(() => {
        const el = document.querySelector('[class*="platform-"]') ?? document.documentElement
        const style = getComputedStyle(el)
        return {
            primaryColor: style.getPropertyValue('--primary').trim(),
            secondaryColor: style.getPropertyValue('--secondary').trim(),
        }
    }, [])

    const primaryCircle = useMemo(() => makeCircle(primary), [primary]);
    const secondaryCircle = useMemo(() => makeCircle(secondary), [secondary]);
    const bounds = useMemo(() => getBounds(primary, secondary), [primary, secondary]);

    return {
        primaryColor,
        secondaryColor,
        primaryCircle,
        secondaryCircle,
        initialViewState: {
            bounds,
            fitBoundsOptions: { padding: 20 },
        },
    }
}