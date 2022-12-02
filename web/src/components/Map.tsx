import { Component, createSignal } from 'solid-js'
import MapGL, { Viewport, Source, Layer } from 'solid-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { css } from 'solid-styled'
import packets from '~/state/packets'
import { positionsForPacket } from '~/utils/geo'

const Container = ({ children }) => {
  css`
    div {
      margin: 0 auto;
      height: 600px;
      width: 1200px;
      border: 1px solid red;
    }
  `
  return <div class="map">{children}</div>
}

const Map: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-122.45, 37.78],
    zoom: 2,
    pitch: 40,
  } as Viewport)

  return (
    <Container>
      <MapGL
        style={{ width: '100%', height: '100%' }}
        options={{
          style: 'mb:sat_street',
          //projection: 'globe'
        }}
        viewport={viewport()}
        onViewportChange={(evt: Viewport) => setViewport(evt)}
      >
        <Source
          source={{
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [-122.414, 37.776],
                      [-77.032, 38.913],
                    ],
                  },
                },
                ...packets().map((packet) => ({
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: positionsForPacket(packet),
                  },
                })),
              ],
            },
          }}
        >
          <Layer
            style={{
              type: 'line',
              //   layout: {
              //     'line-join': 'round',
              //     'line-cap': 'round',
              //   },
              paint: {
                'line-color': '#F88',
                'line-width': 3,
              },
            }}
            beforeType="symbol"
          />
        </Source>
        {/* <Source
          source={{
            type: 'geojson',
            data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
          }}
        >
          <Layer
            style={{
              type: 'heatmap',
              paint: {
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'mag'],
                  0,
                  0,
                  6,
                  1,
                ],
                'heatmap-intensity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  1,
                  9,
                  3,
                ],
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  1,
                  'rgb(178,24,43)',
                ],
                'heatmap-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  2,
                  9,
                  20,
                ],
                'heatmap-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  1,
                  9,
                  0,
                ],
              },
            }}
            beforeType="symbol"
          />
        </Source> */}
      </MapGL>
    </Container>
  )
}

export default Map
