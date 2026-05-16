import {useCallback, useRef, useState} from 'react';

import type {MapRef} from 'react-map-gl/maplibre';

import {Coords, GeoLocation} from '../types';

const DEFAULT_LAT = 10.0
const DEFAULT_LNG = 100.5

type Props = {
    initial: GeoLocation | null,
    emit: (c: Coords, r: number) => void,
}
export const useMapContext = ({initial, emit}: Props) => {
    const mapRef = useRef<MapRef | null>(null)
    const [coords, setCoords] = useState({ lat: initial?.lat ?? DEFAULT_LAT, lng: initial?.lng ?? DEFAULT_LNG })
    const [zoom, setZoom] = useState(9)
    const [radiusKm, setRadius] = useState(initial?.radiusKm ?? 10)

    const handleMove = useCallback(() => {
        if (!mapRef.current) return
        const center = mapRef.current.getCenter()
        const z = mapRef.current.getZoom()
        setCoords({ lat: center.lat, lng: center.lng })
        setZoom(z)
    }, [])

    const handleMoveEnd = useCallback(() => {
        if (!mapRef.current) return
        const center = mapRef.current.getCenter()
        emit({ lat: center.lat, lng: center.lng }, radiusKm)
    }, [radiusKm, emit])

    const handleRadius = useCallback((r: number) => {
        setRadius(r)
        emit(coords, r)
    }, [coords, emit])

    return {
        mapRef,
        coords,
        setCoords,
        zoom,
        radiusKm,
        handleMove,
        handleMoveEnd,
        handleRadius,
    };
}