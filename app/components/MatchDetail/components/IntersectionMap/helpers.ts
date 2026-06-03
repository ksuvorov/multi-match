import { type MatchListingData } from '@/lib/db/queries/match';

export function makeCircle(listing: MatchListingData, steps = 64) {
    const {searchRadiusKm, location} = listing;
    const coords = [];

    for (let i = 0; i <= steps; i++) {
        const angle = (i * 360) / steps
        const rad = (angle * Math.PI) / 180
        const dlat = (searchRadiusKm / 111) * Math.cos(rad)
        const dlng = (searchRadiusKm / (111 * Math.cos((location.lat * Math.PI) / 180))) * Math.sin(rad)
        coords.push([location.lng + dlng, location.lat + dlat])
    }

    return {
        type: 'Feature' as const,
        geometry: { type: 'Polygon' as const, coordinates: [coords] },
        properties: {},
    }
}

export function getBounds(primary: MatchListingData, secondary: MatchListingData): [number, number, number, number] {
    const pad = Math.max(primary.searchRadiusKm, secondary.searchRadiusKm) / 111
    return [
        Math.min(primary.location.lng, secondary.location.lng) - pad,
        Math.min(primary.location.lat, secondary.location.lat) - pad,
        Math.max(primary.location.lng, secondary.location.lng) + pad,
        Math.max(primary.location.lat, secondary.location.lat) + pad,
    ]
}