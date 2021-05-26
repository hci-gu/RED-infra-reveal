import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import * as api from '../hooks/api'
import { useHistory } from 'react-router-dom'

import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { Card, Button, List, Space } from 'antd'

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;

  display: grid;

  > h1 {
    font-size: 48px;
  }
`

const SessionList = () => {
  const history = useHistory()
  const sessions = api.useSessions()
  const [, createSession] = api.useCreateSession()
  const [, updateSession] = api.useUpdateSession()
  const allSessionsDone = sessions.every((s) => !!s.end)

  return (
    <Container>
      <h1>Explore sessions</h1>
      <List
        dataSource={sessions}
        renderItem={(item) => (
          <List.Item style={{ cursor: 'pointer' }}>
            <Space>
              <Card onClick={() => history.push(`/session/${item.id}`)}>
                Session {item.id} -{' '}
                {moment(item.start).format('YYYY-MM-DD HH:mm')}
                {item.end &&
                  ` - ${moment(item.end).format('YYYY-MM-DD HH:mm')}`}
              </Card>
              {!item.end && (
                <Button
                  shape="round"
                  icon={<CheckOutlined />}
                  onClick={(e) => {
                    updateSession({
                      id: item.id,
                      data: { end: new Date().toISOString() },
                    })
                  }}
                  size="large"
                >
                  End session
                </Button>
              )}
            </Space>
          </List.Item>
        )}
      />
      {allSessionsDone && (
        <Button
          style={{ width: 200, height: 44 }}
          shape="round"
          icon={<PlusOutlined />}
          onClick={() =>
            createSession({ data: { start: new Date().toISOString() } })
          }
          size="large"
        >
          Create session
        </Button>
      )}
    </Container>
  )
}

export default SessionList
