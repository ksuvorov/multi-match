'use client'

import Map from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

import { type FieldInputProps } from '../../shared';
import {GeoLocation} from './types';
import {useEnhance} from './hooks';

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'

function getRadiusPx(lat: number, zoom: number, radiusKm: number): number {
    const metersPerPx = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
    return (radiusKm * 1000) / metersPerPx
}

export function LocationField({ value, onChange, error }: FieldInputProps<GeoLocation>) {
    const {
        mapRef,
        coords,
        zoom,
        radiusKm,
        handleMove,
        handleMoveEnd,
        handleRadius,
    } = useEnhance({value, onChange});
    const radiusPx = getRadiusPx(coords.lat, zoom, radiusKm)

    return (
        <div className="flex flex-col gap-3">
            <div className={`relative rounded-lg overflow-hidden h-64 w-full ${error ? 'ring-2 ring-destructive' : ''}`}>
                <Map
                    ref={mapRef}
                    initialViewState={{ longitude: coords.lng, latitude: coords.lat, zoom }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={MAP_STYLE}
                    onMove={handleMove}
                    onMoveEnd={handleMoveEnd}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="rounded-full border-2 border-primary bg-primary/15"
                        style={{
                            width:  radiusPx * 2,
                            height: radiusPx * 2,
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 whitespace-nowrap">Radius</span>
                <input
                    type="range"
                    min={1}
                    max={100}
                    value={radiusKm}
                    onChange={e => handleRadius(Number(e.target.value))}
                    className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">{radiusKm} km</span>
            </div>
        </div>
    )
}