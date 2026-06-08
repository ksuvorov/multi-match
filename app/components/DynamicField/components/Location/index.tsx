'use client'

import Map from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

import { type FieldInputProps } from '../../shared';
import { GeoLocation } from './types';
import { useEnhance } from './hooks';

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
    } = useEnhance({ value, onChange });

    const radiusPx = getRadiusPx(coords.lat, zoom, radiusKm);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className={`flex-1 relative overflow-hidden w-full min-h-0 ${error ? 'ring-2 ring-danger' : ''}`}>
                <div className="absolute inset-0">
                    <Map
                        ref={mapRef}
                        initialViewState={{ longitude: coords.lng, latitude: coords.lat, zoom }}
                        style={{ width: '100%', height: '100%' }}
                        mapStyle={MAP_STYLE}
                        onMove={handleMove}
                        onMoveEnd={handleMoveEnd}
                    />
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-page/40" />

                    <div
                        className="absolute rounded-full border border-brand/70 bg-brand/8"
                        style={{ width: radiusPx * 2, height: radiusPx * 2 }}
                    />

                    {[0, 1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="absolute rounded-full border-2 border-brand/30 animate-sonar"
                            style={{ animationDelay: `${i * 0.45}s` }}
                        />
                    ))}

                    <div className="absolute w-[11px] h-[11px] rounded-full bg-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_25%,transparent),0_0_20px_color-mix(in_srgb,var(--brand)_70%,transparent)]" />
                </div>
            </div>

            <div className="flex flex-col shrink-0 -mt-9 z-10 bg-surface border-t border-border rounded-t-3xl px-5 pt-4">
                <div className="flex items-baseline justify-between mb-3">
                    <div>
                        <p className="text-xl font-extrabold tracking-tight text-fg leading-none">
                            Coverage Zone
                        </p>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-fg-muted mt-1">
                            Dive radius from position
                        </p>
                    </div>
                    <div className="leading-none text-right">
                        <span className="text-[28px] font-extrabold text-brand tracking-tight">
                            {radiusKm}
                        </span>
                        <span className="text-sm font-normal text-fg-muted ml-1">km</span>
                    </div>
                </div>

                <div className="relative flex items-center h-11 mb-1">
                    <div className="absolute inset-x-0 h-[4px] rounded-full bg-brand/10 pointer-events-none" />
                    <div
                        className="absolute left-0 h-[4px] rounded-full bg-gradient-to-r from-brand/40 to-brand pointer-events-none"
                        style={{ width: `${((radiusKm - 1) / 99) * 100}%` }}
                    />
                    <input
                        type="range"
                        min={1}
                        max={100}
                        value={radiusKm}
                        onChange={e => handleRadius(Number(e.target.value))}
                        className="absolute inset-0 w-full cursor-pointer appearance-none outline-none bg-transparent
                              [&::-webkit-slider-runnable-track]:bg-transparent
                              [&::-webkit-slider-runnable-track]:h-[4px]
                              [&::-webkit-slider-thumb]:appearance-none
                              [&::-webkit-slider-thumb]:w-7
                              [&::-webkit-slider-thumb]:h-7
                              [&::-webkit-slider-thumb]:rounded-full
                              [&::-webkit-slider-thumb]:bg-brand
                              [&::-webkit-slider-thumb]:mt-[-5px]
                              [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_color-mix(in_srgb,var(--brand)_18%,transparent),0_4px_10px_rgb(0_0_0/0.5)]
                              [&::-moz-range-track]:bg-transparent
                              [&::-moz-range-track]:h-[4px]
                              [&::-moz-range-thumb]:w-7
                              [&::-moz-range-thumb]:h-7
                              [&::-moz-range-thumb]:rounded-full
                              [&::-moz-range-thumb]:bg-brand
                              [&::-moz-range-thumb]:border-0
                              [&::-moz-range-thumb]:shadow-[0_0_0_6px_color-mix(in_srgb,var(--brand)_18%,transparent),0_4px_10px_rgb(0_0_0/0.5)]"
                        style={{ height: '28px', padding: 0 }}
                    />
                </div>
                <div className="flex justify-between font-mono text-[8px] text-brand/20 mb-4">
                    <span>1</span><span>25</span><span>50</span><span>100 km</span>
                </div>
            </div>
        </div>
    );
}