import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { packetsAtom } from '../state/packets'

export const useSocket = () => {
  const [, setPackets] = useRecoilState(packetsAtom)

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
    })
    socket.on('packets', (incomingPackets) => {
      setPackets((packets) => [...packets, ...incomingPackets])
    })
    return () => {}
  }, [setPackets])
}
