import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { List } from 'antd'
import styled from 'styled-components'
import { packetsFeed } from '../state'

const Container = styled.div`
  color: white;
`

const Packets = () => {
  const packets = useRecoilValue(packetsFeed)
  const items = packets.map((p, i) => ({
    title: p.host,
    index: i,
  }))

  return (
    <Container>
      <List
        bordered
        itemLayout="vertical"
        dataSource={items}
        pagination={{
          pageSize: 20,
        }}
        size={items.length}
        renderItem={(item) => (
          <List.Item key={`${item.title} ${item.index}`}>
            {item.title}
          </List.Item>
        )}
      />
    </Container>
  )
}

export default Packets
