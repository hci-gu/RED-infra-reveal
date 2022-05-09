import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { filteredPackets } from '../state/packets'

const useDashboard = () => {
  const packets = useRecoilValue(filteredPackets)

  useEffect(() => {
    mutation.packets = packets
    mutation.recentPackets = mutation.packets.filter((p) => {
      const diff = mutation.time - new Date(p.timestamp)
      return diff < 15000
    })
  }, [packets])
}

export default useDashboard
