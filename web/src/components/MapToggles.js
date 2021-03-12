import React from 'react'
import { useRecoilState } from 'recoil'
import { mapToggles } from '../state'

import { Card, Checkbox, Space } from 'antd'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  z-index: 100;
`

const MapToggles = () => {
  const [toggles, setToggles] = useRecoilState(mapToggles)

  const onChange = (type, val) => {
    setToggles({
      ...toggles,
      [type]: val,
    })
  }

  return (
    <Container>
      <Card>
        <Space>
          <Space>
            Heatmap
            <Checkbox
              onChange={(e) => onChange('heatmap', e.target.checked)}
              checked={toggles.heatmap}
            />
          </Space>
          <Space>
            Trajectories
            <Checkbox
              onChange={(e) => onChange('trajectories', e.target.checked)}
              checked={toggles.trajectories}
            />
          </Space>
          <Space>
            Packets
            <Checkbox
              onChange={(e) => onChange('packets', e.target.checked)}
              checked={toggles.packets}
            />
          </Space>
        </Space>
      </Card>
    </Container>
  )
}

export default MapToggles
