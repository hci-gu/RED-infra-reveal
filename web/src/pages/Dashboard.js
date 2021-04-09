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
import { activeSessionIdAtom } from '../state'

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;
`

const Spacer = styled.div`
  width: 10px;
  height: 10px;
`

const Dashboard = () => {
  const { id } = useParams()
  const [, setSessionId] = useRecoilState(activeSessionIdAtom)

  useEffect(() => {
    setSessionId(id)
  }, [])

  api.usePackets(id)
  api.useTags()
  const defaultGutter = [12, 12]

  return (
    <Container>
      <Row gutter={defaultGutter}>
        <Col span={4}>
          <SelectFilter field="method" />
          <br></br>
          <SelectFilter field="host" exclude />
        </Col>
        <Col span={14}>
          <TimeHistogram />
        </Col>
        <Col span={6}>
          <HostCloud />
        </Col>
      </Row>
      <Row gutter={defaultGutter}>
        <Col span={18}>
          <Panel>
            <Map />
          </Panel>
        </Col>
        <Col span={6}>
          <Packets />
          <Spacer />
          <Tags />
        </Col>
      </Row>
      {/* <Row>
        <Panel>
          <DebugButton></DebugButton>
        </Panel>
      </Row> */}
    </Container>
  )
}

export default Dashboard
