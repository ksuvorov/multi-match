import type {MapRef} from 'react-map-gl/maplibre';
import {RefObject, useEffect} from 'react';

import {Coords, GeoLocation} from '../types';

type Props = {
    initial: GeoLocation | null,
    coords: Coords,
    setCoords: (coords: Coords) => void,
    radiusKm: number,
    mapRef: RefObject<MapRef | null>,
    emit: (c: Coords, r: number) => void,
}
export const useGeoAccess = ({initial, coords, setCoords, radiusKm, mapRef, emit}: Props) => {
    useEffect(() => {
        if (initial) { emit(initial, radiusKm); return }
        if (!navigator.geolocation) { emit(coords, radiusKm); return }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                setCoords({ lat, lng })
                mapRef?.current?.flyTo({ center: [lng, lat], zoom: 9 })
                emit({ lat, lng }, radiusKm)
            },
            () => emit(coords, radiusKm)
        )
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
}