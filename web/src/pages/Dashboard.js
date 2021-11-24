import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Col, Row, Space } from 'antd'

import Map from '../components/Map'
import Packets from '../components/Packets'
import Tags from '../components/Tags'
import Panel from '../components/Panel'
import TimeHistogram from '../components/TimeHistogram'
import SelectFilter from '../components/SelectFilter'
import HostCloud from '../components/HostCloud'
import * as api from '../hooks/api'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useSocket } from '../hooks/socket'
import { activeSessionIdAtom } from '../state'
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

  > h1 {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #fff;
    > strong {
      color: #a71d31;
      font-size: 26px;
    }
  }
`

const Filters = styled.div`
  display: flex;

  > div {
    width: 100%;
  }

  > div:nth-child(2) {
    margin-left: 10px;
  }
`

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;
`

const Spacer = styled.div`
  width: 10px;
  height: 10px;
`

const PacketsColumn = ({ id }) => {
  api.usePackets(id)

  return (
    <Col span={6}>
      <Statistics />
      <Spacer />
      <Tags />
      <div style={{ height: 265 }} />
      <Packets />
    </Col>
  )
}

const SocketListener = () => {
  useSocket()
  return null
}

const Dashboard = () => {
  const { id } = useParams()
  const [, setSessionId] = useRecoilState(activeSessionIdAtom)

  useEffect(() => {
    setSessionId(id)
  }, [])

  api.useTags()
  api.useSessions()
  const defaultGutter = [12, 12]

  return (
    <Container>
      <Row gutter={defaultGutter}>
        <Col span={4}>
          <SettingsAndFilter>
            <Logo>
              <h1>
                <strong>RED</strong> INFRA REVEAL
              </h1>
              <DashboardSettings />
            </Logo>
            <Filters>
              <SelectFilter field="host" exclude />
              <SelectFilter field="method" />
            </Filters>
          </SettingsAndFilter>
        </Col>
        <Col span={14}>
          <TimeHistogram />
        </Col>
        <Col span={6}>
          <HostCloud />
        </Col>
      </Row>
      <Spacer />
      <Row gutter={defaultGutter}>
        <Col span={18}>
          <Panel>
            <Map />
          </Panel>
        </Col>
        <PacketsColumn id={id} />
      </Row>
      <SocketListener />
    </Container>
  )
}

export default Dashboard
