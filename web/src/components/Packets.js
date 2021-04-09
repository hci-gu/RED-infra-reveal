import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Card, List, Space } from 'antd'
import styled from 'styled-components'
import { packetsFeed } from '../state'
import moment from 'moment'

const Container = styled.div`
  color: white;
  max-height: 600px;
`

const Packets = () => {
  const { packets } = useRecoilValue(packetsFeed)
  const items = packets.map((p, i) => ({
    title: p.host,
    timestamp: moment(p.timestamp).format('HH:mm:ss'),
    index: i,
  }))

  return (
    <Container>
      <Card title={`Packets - ${packets.length}`}>
        <List
          bordered
          itemLayout="vertical"
          dataSource={items}
          pagination={{
            pageSize: 13,
          }}
          size={items.length}
          renderItem={(item) => (
            <List.Item key={`${item.title} ${item.index}`}>
              <Space>
                <span>{item.title}</span>
                <span>{item.timestamp}</span>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Container>
  )
}

export default Packets
