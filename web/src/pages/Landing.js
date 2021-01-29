import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { sessionsAtom } from '../state'
import * as api from '../api'
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
  const [sessions, setSessions] = useRecoilState(sessionsAtom)
  const [refresh, setRefresh] = useState(new Date())
  useEffect(() => {
    const run = async () => {
      const _sessions = await api.getSessions()
      setSessions(_sessions)
    }
    run()
  }, [refresh, setSessions])

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
              {item.id} - {item.start}
            </Card>
          </List.Item>
        )}
      />
      <Button
        shape="round"
        icon={<PlusOutlined />}
        onClick={async () => {
          await api.createSession()
          setRefresh(new Date())
        }}
        size="large"
      >
        Create session
      </Button>
    </Container>
  )
}

export default Landing
