import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Card, Grid, Space, Title } from '@mantine/core'

import Map from '../components/Map'
import Packets from '../components/Packets'
import Tags from '../components/Tags'
import TimeHistogram from '../components/TimeHistogram'
import SelectFilter, { TagFilter } from '../components/SelectFilter'
import HostCloud from '../components/HostCloud'
import * as api from '../hooks/api'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useSocket } from '../hooks/socket'
import { activeSessionIdAtom, settingsAtom } from '../state'
import Statistics from '../components/Statistics'
import DashboardSettings from '../components/DashboardSettings'

const SettingsAndFilter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`

const Logo = styled.div`
  display: flex;
  justify-content: space-between;

  > h1 {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 20px;
    > strong {
      color: #a71d31;
      font-size: 26px;
    }
  }
`

const Filters = styled.div`
  display: flex;
  flex-direction: column;

  > div:nth-child(2) {
    margin-top: 10px;
  }
`

const PacketsColumn = () => {
  return (
    <>
      <Statistics />
      <Space h="md" />
      <Tags />
      <Space h="md" />
      <Packets />
    </>
  )
}

const TopRow = () => {
  return (
    <>
      <Grid.Col span={2}>
        <Card style={{ height: '100%' }} shadow="sm">
          <SettingsAndFilter>
            <Logo>
              <Title>
                <strong>RED</strong> INFRA REVEAL
              </Title>
              <DashboardSettings />
            </Logo>
            <Filters>
              {/* <SelectFilter field="host" /> */}
              <SelectFilter field="method" />
              <TagFilter />
            </Filters>
          </SettingsAndFilter>
        </Card>
      </Grid.Col>
      <Grid.Col span={7}>
        <TimeHistogram />
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm">
          <HostCloud />
        </Card>
      </Grid.Col>
    </>
  )
}

const SocketListener = () => {
  useSocket()
  return null
}

const Dashboard = () => {
  const { id } = useParams()
  const [, setSessionId] = useRecoilState(activeSessionIdAtom)
  const settings = useRecoilValue(settingsAtom)

  useEffect(() => {
    setSessionId(id)
  }, [])

  api.useTags()
  api.useSessions()
  api.usePackets(id)

  return (
    <Grid columns={12} p="md" gutter="md">
      {!settings.focusOnMap && <TopRow />}
      <Grid.Col span={settings.focusOnMap ? 12 : 9}>
        <Map />
      </Grid.Col>
      {!settings.focusOnMap && (
        <Grid.Col span={3}>
          <PacketsColumn id={id} />
        </Grid.Col>
      )}
      {settings.focusOnMap && (
        <Grid.Col>
          <TimeHistogram />
        </Grid.Col>
      )}
      <SocketListener />
    </Grid>
  )
}

export default Dashboard
