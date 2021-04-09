import React, { useState, useRef, useEffect } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import {
  AMapScene,
  LineLayer,
  PointLayer,
  HeatmapLayer,
  Popup,
  LayerEvent,
} from '@antv/l7-react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  packetTrajectories,
  packetOrigins,
  packetsAlongTrajectories,
  mapToggles,
} from '../state'
import MapToggles from './MapToggles'
import { Card } from 'antd'

const Trajectories = () => {
  const features = useRecoilValue(packetTrajectories)

  return (
    <LineLayer
      source={{
        data: {
          type: 'FeatureCollection',
          features,
        },
      }}
      shape={{ values: 'line' }}
      color={{
        values: ['#FF7C6A'],
      }}
      scale={{
        value: 0.1,
      }}
      size={{
        values: 1,
      }}
      style={{
        opacity: 0.25,
      }}
    />
  )
}

const HeatMap = () => {
  const features = useRecoilValue(packetOrigins)

  return (
    <HeatmapLayer
      source={{
        data: {
          type: 'FeatureCollection',
          features,
        },
      }}
      shape={{
        values: 'heatmap3d',
      }}
      style={{
        intensity: 0.25,
        radius: 15,
        opacity: 0.75,
        rampColors: {
          colors: [
            '#FF4818',
            '#F7B74A',
            '#FFF598',
            '#91EABC',
            '#2EA9A1',
            '#206C7C',
          ].reverse(),
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      }}
    />
  )
}

const Points = ({ setPopupInfo }) => {
  const features = useRecoilValue(packetsAlongTrajectories)

  const showPopup = (args) => {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature.properties,
    })
  }

  return (
    <>
      <PointLayer
        source={{
          data: {
            type: 'FeatureCollection',
            features,
          },
        }}
        shape={{
          values: 'dot',
        }}
        color={{
          values: '#FF7C6A',
        }}
        size={{
          values: 2,
        }}
        style={{
          values: {
            opacity: 0.75,
          },
        }}
      >
        <LayerEvent type="mousedown" handler={showPopup}></LayerEvent>
      </PointLayer>
    </>
  )
}

const Container = styled.div`
  width: 100%;
  height: 1000px;
`

const Map = () => {
  const { heatmap, trajectories, packets } = useRecoilValue(mapToggles)
  const [popupInfo, setPopupInfo] = useState()

  return (
    <Container>
      <MapToggles />
      <AMapScene
        map={{
          center: [11.91737, 57.69226],
          pitch: 45,
          style: 'dark',
          zoom: 1,
          features: ['bg'],
        }}
        option={{
          logoVisible: false,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {trajectories && <Trajectories />}
        {packets && <Points setPopupInfo={setPopupInfo} />}
        {heatmap && <HeatMap />}
        {popupInfo && (
          <Popup lnglat={popupInfo.lnglat}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: 0,
                color: '#000',
              }}
            >
              <strong>
                {moment(popupInfo.feature.timestamp).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </strong>
              <span>Host: {popupInfo.feature.host}</span>
              <span>Method: {popupInfo.feature.method}</span>
            </div>
          </Popup>
        )}
      </AMapScene>
    </Container>
  )
}

export default Map
