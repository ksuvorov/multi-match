'use client'

import Map, { Layer, Source } from 'react-map-gl/maplibre'
import { memo } from 'react'

import { MatchListingData } from '@/lib/db/queries/match';

import 'maplibre-gl/dist/maplibre-gl.css'

import { useEnhance } from './hooks';

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json';
const ROOT_STYLES = { width: '100%', height: '100%', borderRadius: 10 };

type Props = {
    primary: MatchListingData,
    secondary: MatchListingData,
};
function IntersectionMap({primary, secondary}: Props) {
    const {
        primaryCircle, secondaryCircle,
        primaryColor, secondaryColor,
        initialViewState,
    } = useEnhance(primary, secondary);

    return (
        <Map
            initialViewState={initialViewState}
            style={ROOT_STYLES}
            mapStyle={MAP_STYLE}
            interactive={false}
        >
            <Source id="primary-circle" type="geojson" data={primaryCircle}>
                <Layer
                    id="primary-circle-fill"
                    type="fill"
                    paint={{ 'fill-color': primaryColor, 'fill-opacity': 0.15 }}
                />
                <Layer
                    id="primary-circle-stroke"
                    type="line"
                    paint={{ 'line-color': primaryColor, 'line-width': 1.5 }}
                />
            </Source>

            <Source id="secondary-circle" type="geojson" data={secondaryCircle}>
                <Layer
                    id="secondary-circle-fill"
                    type="fill"
                    paint={{ 'fill-color': secondaryColor, 'fill-opacity': 0.15 }}
                />
                <Layer
                    id="secondary-circle-stroke"
                    type="line"
                    paint={{ 'line-color': secondaryColor, 'line-width': 1.5 }}
                />
            </Source>
        </Map>
    );
}

export default memo(IntersectionMap)