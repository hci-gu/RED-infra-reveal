import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Card, Pagination, Table } from '@mantine/core'
import { filteredPackets, mutationAtom } from '../state/packets'

const Packets = () => {
  const mutation = useRecoilValue(mutationAtom)
  const packets = useRecoilValue(filteredPackets)
  const [page, setPage] = useState(1)

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
  const pageSize = 10
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize)

  return (
    <Card shadow="sm">
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Host</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={`Packet_${item.title}_${item.index}`}>
              <td>{item.title}</td>
              <td>{item.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        size="sm"
        total={Math.floor(items.length / pageSize) + 1}
        page={page}
        onChange={setPage}
      />
    </Card>
  )
}

export default Packets
