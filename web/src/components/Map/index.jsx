import React, { useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { AMapScene, Popup, LineLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { mapToggles, settingsAtom } from '../../state'
import MapToggles from './MapToggles'
import Clients from './Clients'
import MapFilters from './MapFilters'
import Trajectories from './Trajectories'
import Heatmap from './Heatmap'
import Points from './Points'
import { Card } from '@mantine/core'
import worldData from './world.json'

const Container = styled.div`
  position: relative;
  height: calc(100vh - 275px);
  z-index: 0;

  ${({ fullHeight }) => fullHeight && 'height: 95vh;'}
`

const Map = () => {
  const settings = useRecoilValue(settingsAtom)
  const { heatmap, trajectories, packets } = useRecoilValue(mapToggles)
  const [popupInfo, setPopupInfo] = useState()
  const [mapScene, setMapScene] = useState()

  return (
    <Card p={0} shadow="sm">
      <Container fullHeight={settings.focusOnMap}>
        <Clients />
        <MapToggles />
        <AMapScene
          map={{
            center: [11.91737, 57.69226],
            pitch: 45,
            style: settings.darkMode ? 'dark' : 'fresh',
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
            transform: settings.flipMap ? 'scaleY(-1)' : undefined,
          }}
          onSceneLoaded={(scene) => {
            scene.addImage('plain_text', '/svg/plain_text.svg')
            scene.addImage('image', '/svg/image.svg')
            scene.addImage('html', '/svg/html.svg')
            scene.addImage('default', '/svg/default.svg')
            setMapScene(scene)
          }}
        >
          {trajectories && <Trajectories />}
          {packets && <Points setPopupInfo={setPopupInfo} />}
          {heatmap && <Heatmap />}
          {mapScene && <MapFilters scene={mapScene} />}
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
                  {popupInfo.feature &&
                    new Date(popupInfo.feature.timestamp).toLocaleTimeString()}
                </strong>
                <span>Host: {popupInfo.feature && popupInfo.feature.host}</span>
                <span>
                  Method: {popupInfo.feature && popupInfo.feature.method}
                </span>
              </div>
            </Popup>
          )}
          <LineLayer
            source={{
              data: worldData,
            }}
            size={{
              values: 0.2,
            }}
            color={{
              values: settings.darkMode ? '#fff' : '#000',
            }}
            shape={{
              values: 'line',
            }}
            style={{
              opacity: settings.darkMode ? 0.1 : 0.2,
            }}
          />
        </AMapScene>
      </Container>
    </Card>
  )
}

export default Map
