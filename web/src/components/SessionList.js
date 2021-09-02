import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import * as api from '../hooks/api'
import { useHistory } from 'react-router-dom'

import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { Card, Button, List, Space } from 'antd'

const Container = styled.div`
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 32px 0;
  padding-right: 24px;

  display: grid;

  > h1 {
    font-size: 20px;
    font-weight: 700;
    font-family: 'Josefin Sans', sans-serif;
    text-transform: uppercase;
  }

  > div {
    display: flex;
    overflow-x: scroll;
  }
`

const SessionContainer = styled.div`
  width: 240px;
  height: 190px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  color: #000;
  background-color: #ece5f0;

  > div > img {
  }

  > div {
    padding: 4px 8px;
    font-size: 12px;
    > span {
      font-size: 14px;
      font-weight: 500;
    }
  }
`

const IMAGE_URL = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/11.9092,57.6807,4,0/320x180?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
const imageUrlForSession = (session) => {
  if (session.clientPositions && session.clientPositions.length) {
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${session.clientPositions.map(
      (p) => `pin-s+a71d31(${p.lon},${p.lat})`
    )}/${session.center.lon},${session.center.lat},1,0/320x180?access_token=${
      process.env.REACT_APP_MAPBOX_TOKEN
    }`
  }

  return IMAGE_URL
}

const Session = ({ session }) => {
  const history = useHistory()
  const [, updateSession] = api.useUpdateSession()

  return (
    <SessionContainer onClick={() => history.push(`/session/${session.id}`)}>
      <img src={imageUrlForSession(session)}></img>
      <div>
        <span>{session.name ? session.name : `Session ${session.id}`}</span>
        <br></br>
        {moment(session.start).format('YYYY-MM-DD')}
        {session.end &&
          ` - ${moment(session.end).diff(moment(session.start), 'minutes')}min`}
        <div>
          {!session.end && (
            <Button
              shape="round"
              style={{ color: '#000' }}
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                updateSession({
                  id: session.id,
                  data: { end: new Date().toISOString() },
                })
              }}
              size="large"
            >
              End session
            </Button>
          )}
        </div>
      </div>
    </SessionContainer>
  )
}

const SessionList = ({ title }) => {
  const sessions = api.useSessions()
  const [, createSession] = api.useCreateSession()
  const allSessionsDone = sessions.every((s) => !!s.end)

  const oldSessions = sessions.filter((s) => !!s.end)
  const activeSessions = sessions.filter((s) => !s.end)

  return (
    <Container>
      <h1>{title}</h1>
      <div>
        {activeSessions.length > 0 &&
          activeSessions.map((s) => (
            <Session session={s} key={`Session_${s.id}`} />
          ))}
        {oldSessions.map((s) => (
          <Session session={s} key={`Session_${s.id}`} />
        ))}
      </div>
      {allSessionsDone && (
        <Button
          style={{ marginTop: 24, width: 200, height: 44 }}
          shape="round"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.preventDefault()
            createSession({ data: { start: new Date().toISOString() } })
          }}
          size="large"
        >
          Start a session
        </Button>
      )}
    </Container>
  )
}

export default SessionList
