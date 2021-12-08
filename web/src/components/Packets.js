import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { List, Space } from 'antd'
import styled from 'styled-components'
import { filteredPackets, mutationAtom } from '../state/packets'

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
    timestamp: new Date(p.timestamp).toLocaleTimeString(),
    index,
  }))

  return (
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
  )
}

export default Packets
