import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'

import Map from '../components/Map'
import Packets from '../components/Packets'
import Panel from '../components/Panel'
import TimeHistogram from '../components/TimeHistogram'
import SelectFilter from '../components/SelectFilter'
import HostCloud from '../components/HostCloud'
import { useRecoilState } from 'recoil'
import { packetsAtom } from '../state'
import * as api from '../hooks/api'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;
`

const Dashboard = () => {
  const { id } = useParams()
  api.usePackets(id)
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
        {/* <Col span={8}>
          <Panel>
            <Categories />
          </Panel>
        </Col>
        <Col span={8}>
          <Panel>sdasdsd</Panel>
        </Col> */}
      </Row>
      <Row gutter={defaultGutter}>
        <Col span={18}>
          <Panel>
            <Map />
          </Panel>
        </Col>
        <Col span={6}>
          <Packets />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
