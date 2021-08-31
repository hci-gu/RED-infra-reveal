import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { packetsAtom } from '../state'

export const useSocket = () => {
  const [, setPackets] = useRecoilState(packetsAtom)

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      transports: ['websocket'],
    })
    socket.on('packets', (incomingPackets) => {
      setPackets((packets) => [...packets, ...incomingPackets])
    })
    return () => {}
  }, [setPackets])
}
