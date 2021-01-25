import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetsFeed } from '../state'

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: black;
  padding: 20px;
  color: white;
  z-index: 10;

  width: 320px;
  height: 100vh;
  overflow-y: scroll;

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`

const PacketListItem = styled.li`
  margin-top: 5px;
  font-size: 16px;

  > span > strong {
    font-size: 11px;
  }
`

const PacketsPanel = () => {
  const packets = useRecoilValue(packetsFeed)

  return (
    <Container>
      <h2>Packets - {packets.length}</h2>
      <ul>
        {packets.map((p, i) => (
          <PacketListItem key={`Packet_${i}`}>
            <span>
              <strong>[{p.timestamp.slice(11, 16)}]</strong> {p.host}
            </span>
          </PacketListItem>
        ))}
      </ul>
    </Container>
  )
}

export default PacketsPanel
