import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import * as api from '../hooks/api'
import { useHistory } from 'react-router-dom'

import { PlusOutlined } from '@ant-design/icons'
import { Card, Button, List } from 'antd'

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Landing = () => {
  const history = useHistory()
  const sessions = api.useSessions()
  const [, createSession] = api.useCreateSession()

  return (
    <Container>
      <h1>Infra reveal</h1>
      <List
        dataSource={sessions}
        renderItem={(item) => (
          <List.Item
            onClick={() => history.push(`/session/${item.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <Card>
              Session {item.id} -{' '}
              {moment(item.start).format('YYYY-MM-DD HH:mm')}
            </Card>
          </List.Item>
        )}
      />
      <Button
        shape="round"
        icon={<PlusOutlined />}
        onClick={() =>
          createSession({ data: { start: new Date().toISOString() } })
        }
        size="large"
      >
        Create session
      </Button>
    </Container>
  )
}

export default Landing
