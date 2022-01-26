import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import * as api from '../hooks/api'
import { useHistory } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'

import { PlusOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { Card, Button, List, Space } from 'antd'
import { RichText } from 'prismic-reactjs'

const Container = styled.div`
  z-index: 2;
  width: 100%;
  height: 100%;
  margin-top: 50px;
  min-height: 400px;
  padding-bottom: 150px;
  padding-right: 24px;

  display: grid;

  > h1 {
    max-width: 750px;
    font-size: 24px;
    font-weight: 300;
    font-family: 'Roboto', sans-serif;
  }

  > div {
    width: 100%;
    display: flex;
    overflow-x: auto;
  }
`

const SessionContainer = styled.div`
  margin-right: 10px;
  width: 240px;
  min-width: 240px;
  height: 190px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  color: #000;
  background-color: #ece5f0;

  > div {
    padding: 4px 8px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      font-size: 14px;
      font-weight: 400;
    }
  }
`
const bboxToString = (bbox) => `[${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}]`

const IMAGE_URL = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/11.9092,57.6807,4,0/320x180?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
const imageUrlForSession = (session) => {
  if (session.clientPositions && session.clientPositions.length === 1) {
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${session.clientPositions.map(
      (p) => `pin-s+a71d31(${p.lon},${p.lat})`
    )}/${session.center.lon},${session.center.lat},1,0/320x180?access_token=${
      process.env.REACT_APP_MAPBOX_TOKEN
    }`
  } else if (session.clientPositions && session.clientPositions.length) {
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${session.clientPositions.map(
      (p) => `pin-s+a71d31(${p.lon},${p.lat})`
    )}/${bboxToString(session.bbox)}/320x180?padding=50&access_token=${
      process.env.REACT_APP_MAPBOX_TOKEN
    }`
  }

  return IMAGE_URL
}

const LiveIndicator = styled.div`
  width: 14px;
  height: 11px;
  margin: 0 auto;
  display: inline-block;

  > div {
    vertical-align: middle;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    position: absolute;
    margin: 0 auto;
    border: 3px solid rgba(167, 29, 49, 1);
    animation: live 1.4s infinite ease-in-out;
    animation-fill-mode: both;
    &:nth-child(1) {
      background-color: rgba(167, 29, 49, 0.3);
      background-color: rgba(167, 29, 49, 1);
      animation-delay: -0.1s;
    }
    &:nth-child(2) {
      animation-delay: 0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0.42s;
      border: 3px solid rgba(167, 29, 49, 0.5);
    }
    &:nth-child(4) {
      border: 3px solid rgba(167, 29, 49, 1);
      animation-delay: -0.42s;
    }
  }

  @keyframes live {
    0%,
    80%,
    100% {
      transform: scale(0.8);
    }
    40% {
      transform: scale(1);
    }
  }
`

const displayDuration = (session) =>
  humanizeDuration(moment(session.end).diff(moment(session.start)), {
    largest: 2,
    round: true,
    language: 'shortEn',
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'min',
        s: () => 'sec',
        ms: () => 'ms',
      },
    },
  })

const Session = ({ session }) => {
  const history = useHistory()
  const [, updateSession] = api.useUpdateSession()

  return (
    <SessionContainer onClick={() => history.push(`/session/${session.id}`)}>
      <img src={imageUrlForSession(session)}></img>
      <div>
        <span>
          {!session.end && (
            <LiveIndicator>
              <div />
            </LiveIndicator>
          )}
          <strong>
            {session.name ? session.name : `Session ${session.id}`}
          </strong>
          <br></br>
          {moment(session.start).format('YYYY-MM-DD')}
          <span style={{ fontWeight: 200 }}>
            {session.end && ` ${displayDuration(session)}`}
          </span>
        </span>
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
              size="small"
            >
              Stop
            </Button>
          )}
        </div>
      </div>
    </SessionContainer>
  )
}

const LoadingIndicator = styled.div`
  margin-right: 10px;
  width: 240px;
  min-width: 240px;
  height: 190px;
  border-radius: 8px;
  color: #ece5f0;
  background-color: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 190px;

  font-size: 18px;
  font-weight: 300;

  > span {
    margin-top: 10px;
    font-size: 28px;
  }
`

const SessionList = ({ title }) => {
  const sessions = api.useSessions()
  const [, createSession] = api.useCreateSession()
  const allSessionsDone = sessions.every((s) => !!s.end)

  return (
    <Container>
      <RichText render={title} />
      <div>
        {sessions.length > 0
          ? sessions.map((s) => <Session session={s} key={`Session_${s.id}`} />)
          : Array.from({ length: 5 }).map((_, i) => (
              <LoadingIndicator key={`Session_loading_${i}`}>
                <LoadingOutlined />
              </LoadingIndicator>
            ))}
      </div>
      {allSessionsDone && (
        <Button
          type="primary"
          style={{
            marginTop: 24,
            width: 180,
            height: 44,
            borderRadius: 8,
            borderColor: '#a71d31',
            backgroundColor: '#a71d31',
          }}
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
