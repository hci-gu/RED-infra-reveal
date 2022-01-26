import React, { useState } from 'react'
import GlobeGl from 'react-globe.gl'
import styled from 'styled-components'
import { SizeMe } from 'react-sizeme'
import routesJSON from '../data/routes.json'
import { useRecoilState } from 'recoil'
import { globeAtom } from '../state'

const GlobeContainer = styled.div`
  position: absolute;
  top: -150px;
  left: -25vw;
  width: 100vw;
  height: 175vh;
  pointer-events: auto;
  background: none;
  z-index: 1;
`

function GlobeElement({ size }) {
  const { useEffect, useRef } = React
  const [globeSettings] = useRecoilState(globeAtom)
  const [routes, setRoutes] = useState([])
  const globeEl = useRef()

  useEffect(() => {
    globeEl.current.pointOfView({ altitude: 3.5 })
    globeEl.current.controls().enableZoom = false
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = 0.25
    setRoutes(routesJSON)
  }, [])

  useEffect(() => {
    globeEl.current.pointOfView({ altitude: globeSettings.altitude })
    globeEl.current.controls().autoRotate = globeSettings.autoRotate
  }, [globeSettings])

  return (
    <GlobeGl
      ref={globeEl}
      width={size.width}
      height={size.height}
      showGlobe={true}
      backgroundColor={'rgba(0, 0, 0, 0)'}
      // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      arcsData={routes}
      arcStartLat={(d) => +d.src.lat}
      arcStartLng={(d) => +d.src.lng}
      arcEndLat={(d) => +d.dst.lat}
      arcEndLng={(d) => +d.dst.lng}
      arcDashLength={0.15}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={5000}
      arcColor={(d) => [`rgba(167, 29, 49, 0.75)`, `rgba(167, 29, 49, 1)`]}
      arcsTransitionDuration={0}
      arcStroke={0.5}
    />
  )
}

function Globe() {
  return (
    <GlobeContainer>
      <SizeMe monitorHeight style={{ height: '100%' }}>
        {({ size }) => <GlobeElement size={size} />}
      </SizeMe>
    </GlobeContainer>
  )
}

export default Globe
