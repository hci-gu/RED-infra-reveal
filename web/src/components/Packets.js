import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Card, List, Space } from 'antd'
import styled from 'styled-components'
import { filteredPackets, mutationAtom } from '../state'
import moment from 'moment'

const Container = styled.div`
  color: white;
  max-height: 600px;
`

const Packets = () => {
  const mutation = useRecoilValue(mutationAtom)
  const packets = useRecoilValue(filteredPackets)

  useEffect(() => {
    mutation.packets = packets
    mutation.recentPackets = mutation.packets.filter((p) => {
      const diff = mutation.time - new Date(p.timestamp)
      return diff < 15000
    })
  }, [packets])

  const items = packets.map((p, index) => ({
    title: p.host,
    timestamp: moment(p.timestamp).format('HH:mm:ss'),
    index,
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
