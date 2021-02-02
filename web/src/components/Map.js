import React, { useState } from 'react'
import ReactMapGL, { Source, Layer } from 'react-map-gl'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { packetsFeed } from '../state'
import { heatmapLayer } from '../mapStyle'

const Container = styled.div`
  width: 100%;
  height: 800px;
`

const Map = () => {
  const packets = useRecoilValue(packetsFeed)
  console.log(packets)
  const [viewport, setViewport] = useState({
    latitude: 57.70887,
    longitude: 11.97456,
    zoom: 1.6,
  })
  const geojson = {
    type: 'FeatureCollection',
    features: packets.map((p) => ({
      type: 'Feature',
      properties: {},
      geometry: {
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:4326',
          },
        },
        type: 'Point',
        coordinates: [p.lat, p.lon],
      },
    })),
  }

  return (
    <Container>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoic2ViYXN0aWFuYWl0IiwiYSI6ImNrZWlvaXlhMTI3dm8ycm1peHlwOW0yNGMifQ.hXGRGr7WQWwyrvMfUaNiCQ"
        mapStyle="mapbox://styles/sebastianait/ckk2kmvvq3jji17lnlahq2ijx"
        width="100%"
        height="100%"
        onViewportChange={(viewport) => setViewport(viewport)}
      >
        <Source type="geojson" data={geojson}>
          <Layer {...heatmapLayer} />
        </Source>
      </ReactMapGL>
    </Container>
  )
}

export default Map