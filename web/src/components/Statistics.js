import { Col, Divider, Row, Statistic } from 'antd'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { filteredPackets, packetContentSize } from '../state'
import { displayBytes } from '../utils'

const Statistics = () => {
  const totalContentSize = useRecoilValue(packetContentSize)
  const packets = useRecoilValue(filteredPackets)

  return (
    <>
      <Divider style={{ margin: 4 }} />
      <Row gutter={16} style={{ margin: `0 4px` }} justify="center">
        <Col>
          <Statistic title="Number of packets" value={packets.length} />
        </Col>
        <Col>
          <Statistic
            title="Data amount"
            value={displayBytes(totalContentSize)}
          />
        </Col>
        <Col>
          <Statistic title="Average response time" value={`- ms`} />
        </Col>
      </Row>
      <Divider style={{ margin: 4 }} />
    </>
  )
}

export default Statistics
