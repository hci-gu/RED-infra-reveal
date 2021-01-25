import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { packetsAtom } from '../state'

export const useSocket = () => {
  const [_, setPackets] = useRecoilState(packetsAtom)

  useEffect(() => {
    const socket = io('http://localhost:4000')

    socket.on('packet', (packet) =>
      setPackets((packets) => [...packets, packet])
    )
    return () => {}
  }, [setPackets])
}
