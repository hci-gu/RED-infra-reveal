import React from 'react'
import { useRecoilValue } from 'recoil'
import { packetClients } from '../state'

import { Card, Checkbox, Space } from 'antd'
import styled from 'styled-components'
import { getColorFromId } from '../utils'

const Container = styled.div`
  position: absolute;
  right: 10px;
  z-index: 100;
`

const Client = styled.div`
  display: flex;
  align-items: center;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;

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
        {clients.map((c, i) => (
          <Client key={c}>
            <Dot color={getColorFromId(c)} /> Client {i + 1}
          </Client>
        ))}
      </Card>
    </Container>
  )
}

export default Clients
