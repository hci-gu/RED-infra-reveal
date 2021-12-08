import React from 'react'
import { useRecoilValue } from 'recoil'
import { packetClients } from '../../state'
import { Card } from 'antd'
import styled from 'styled-components'
import { getColorFromId } from '../../utils'

const Container = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  z-index: 100;
`

const ClientList = styled.div`
  max-width: 100px;
  max-height: 600px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`

const Client = styled.div`
  display: flex;
  align-items: center;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;

  background-color: ${({ color }) => color};
`

const Clients = () => {
  const clients = useRecoilValue(packetClients)

  if (!clients.length) {
    return null
  }

  return (
    <Container>
      <Card size="small">
        <h2>{clients.length} clients</h2>
        <ClientList>
          {clients.map((c, i) => (
            <Client key={c}>
              <Dot color={getColorFromId(c)} /> {i + 1}
            </Client>
          ))}
        </ClientList>
      </Card>
    </Container>
  )
}

export default Clients
