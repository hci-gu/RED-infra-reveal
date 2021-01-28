import React from 'react'
import styled from 'styled-components'
import { Card, Col, Row } from 'antd'

import Map from '../components/Map'
import Packets from '../components/Packets'
import Panel from '../components/Panel'
import Categories from '../components/Categories'

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;
`

const Dashboard = () => {
  const defaultGutter = [12, 12]

  return (
    <Container>
      {/* <Row gutter={defaultGutter}>
        <Col span={8}>
          <Panel>hejsan</Panel>
        </Col>
        <Col span={8}>
          <Panel>
            <Categories />
          </Panel>
        </Col>
        <Col span={8}>
          <Panel>sdasdsd</Panel>
        </Col>
      </Row> */}
      <Row gutter={defaultGutter}>
        <Col span={18}>
          <Panel>
            <Map />
          </Panel>
        </Col>
        <Col span={6}>
          <Panel>
            <Packets />
          </Panel>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
