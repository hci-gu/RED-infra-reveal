import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mapToggles, settingsAtom } from '../../state'

import { Card, Center, Checkbox, Grid, Space, Text } from '@mantine/core'
import styled from 'styled-components'
import DashboardSettings from '../DashboardSettings'

const Container = styled.div`
  position: absolute;
  margin: 0.5rem;
  z-index: 100;
`

const MapToggles = () => {
  const [toggles, setToggles] = useRecoilState(mapToggles)
  const settings = useRecoilValue(settingsAtom)

  const onChange = (type, val) => {
    setToggles({
      ...toggles,
      [type]: val,
    })
  }

  return (
    <Container>
      <Card p="xs">
        <Grid columns={settings.focusOnMap ? 13 : 12} align="center">
          {settings.focusOnMap && (
            <Grid.Col span={1}>
              <DashboardSettings />
            </Grid.Col>
          )}
          <Grid.Col span={4}>
            <Center>
              <Text size="xs">Heatmap</Text>
              <Space w="xs" />
              <Checkbox
                size="xs"
                onChange={(e) => onChange('heatmap', e.target.checked)}
                checked={toggles.heatmap}
              />
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Text size="xs">Trajectories</Text>
              <Space w="xs" />
              <Checkbox
                size="xs"
                onChange={(e) => onChange('trajectories', e.target.checked)}
                checked={toggles.trajectories}
              />
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Text size="xs">Packets</Text>
              <Space w="xs" />
              <Checkbox
                size="xs"
                onChange={(e) => onChange('packets', e.target.checked)}
                checked={toggles.packets}
              />
            </Center>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  )
}

export default MapToggles
