import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Button } from '@mantine/core'
import React from 'react'
import styled from 'styled-components'
import { useFireWallSettings } from '../../hooks/api'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    margin-top: 16px;
    width: 50%;
  }

  > span {
    font-size: 18px;
    text-align: center;
  }
`

const messageForState = (isLoading, added) => {
  if (isLoading) {
    return <span>Loading...</span>
  }
  if (added) {
    return (
      <span>
        <CheckCircleOutlined style={{ color: 'lime', marginRight: '0.5rem' }} />
        You are added to the allow-list. You can now connect to the proxy, if
        you are done using the tool please remove yourself.
      </span>
    )
  }
  return (
    <span>
      <WarningOutlined style={{ color: 'red', marginRight: '0.5rem' }} />
      You are not added to the allow-list, the proxy will not work until you are
    </span>
  )
}

const Firewall = () => {
  const [isLoading, added, toggle] = useFireWallSettings()
  return (
    <Container>
      {messageForState(isLoading, added)}
      <Button
        style={{ fontSize: 16 }}
        size="large"
        onClick={() => toggle()}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : added ? 'Remove yourself' : 'Add me'}
      </Button>
    </Container>
  )
}

export default Firewall
