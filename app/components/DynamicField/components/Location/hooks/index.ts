import {useCallback} from 'react';

import {useGeoAccess} from './useGeoAccess';
import type {FieldInputProps} from '../../../shared';
import {useMapContext} from './useMapContext';
import {GeoLocation} from '../types';

export const useEnhance = ({value, onChange}: FieldInputProps<GeoLocation>) => {
    const initial = typeof value === 'object' && value !== null ? value as GeoLocation : null;
    const emit = useCallback((c: { lat: number; lng: number }, r: number) => {
        onChange({ ...c, radiusKm: r })
    }, [onChange]);
    const {
        mapRef,
        coords,
        setCoords,
        zoom,
        radiusKm,
        handleMove,
        handleMoveEnd,
        handleRadius,
    } = useMapContext({initial, emit});
    useGeoAccess({initial, coords, setCoords, radiusKm, mapRef, emit})
    return {
        mapRef,
        coords,
        zoom,
        radiusKm,
        handleMove,
        handleMoveEnd,
        handleRadius,
    }
}