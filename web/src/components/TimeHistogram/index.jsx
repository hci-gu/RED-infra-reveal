import React, { useEffect, useState } from 'react'
import { activeSession, settingsAtom } from '../../state'
import { isPlayingAtom, mutationAtom, timeAtom } from '../../state/packets'
import darkTheme from './darkTheme.json'
import lightTheme from './darkTheme.json'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Line } from '@ant-design/charts'
import { Button, Card, Slider, Space } from '@mantine/core'
import {
  PauseOutlined,
  CaretRightOutlined,
  FastForwardOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'

const Container = styled.div`
  height: 180px;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
`

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  padding-top: 4px;

  > div:nth-child(1) {
    flex: 1;
    margin: 10px;
  }
`
const roundDate = (date) => {
  const rounded = new Date(date)
  rounded.setSeconds(0)
  return rounded
}

const packetsToBuckets = (packets, start, end) => {
  // generate 30 second buckets from start to end
  const initialBuckets = {}
  const startDate = roundDate(start)
  const endDate = roundDate(end)
  const bucketSize = 30000
  const bucketCount = Math.floor((endDate - startDate) / bucketSize)
  for (let i = 0; i < bucketCount; i++) {
    const date = new Date(startDate.getTime() + i * bucketSize)
    const key = date.toLocaleTimeString()
    initialBuckets[key] = {
      value: 0,
      date: date,
    }
  }

  const buckets = packets.reduce((acc, curr) => {
    const time = new Date(curr.timestamp)
    const seconds = time.getSeconds()
    const remainder = 30 - (seconds % 30)

    time.setSeconds(seconds + remainder)
    const key = time.toLocaleTimeString()
    if (!acc[key]) {
      acc[key] = {
        value: 1,
        date: time,
      }
    } else {
      acc[key].value++
    }
    return acc
  }, initialBuckets)

  return Object.keys(buckets)
    .map((time) => ({
      time,
      date: buckets[time].date,
      value: buckets[time].value,
    }))
    .sort((a, b) => a.date - b.date)
}

const LineChartContainer = styled.div`
  height: 100%;
  border-radius: 4px;
`

const LineChart = ({ min, max, isLive }) => {
  const [graph, setGraph] = useState()
  const mutation = useRecoilValue(mutationAtom)
  const { darkMode } = useRecoilValue(settingsAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      graph.changeData(packetsToBuckets(mutation.allPackets, min, max))
    }, 1000)
    return () => clearInterval(interval)
  }, [min, max, graph])

  const config = {
    data: packetsToBuckets(mutation.allPackets, min, max),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      tickCount: 16,
    },
    smooth: true,
    theme: darkMode ? darkTheme : lightTheme,
  }

  return (
    <LineChartContainer>
      <Line {...config} onReady={setGraph} />
    </LineChartContainer>
  )
}

const TIME_INC = 100
const TimeSlider = ({ session, min, max }) => {
  const mutation = useRecoilValue(mutationAtom)
  const [time, setTime] = useRecoilState(timeAtom)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      if (isPlaying && !!session.end) {
        setTime((s) => s + TIME_INC)
      } else if (isPlaying) {
        setTime(Date.now())
      }
    }, TIME_INC)

    return () => clearInterval(interval)
  }, [isPlaying, setTime])

  useEffect(() => {
    mutation.time = time
    mutation.packets = mutation.allPackets.filter((p) => {
      const diff = mutation.time - new Date(p.timestamp)
      return diff > 0
    })
    mutation.recentPackets = mutation.packets.filter((p) => {
      const diff = mutation.time - new Date(p.timestamp)
      return diff < 15000
    })
  }, [time])

  useEffect(() => {
    if (!session.end) setIsPlaying(true)
  }, [setIsPlaying])

  return (
    <SliderContainer>
      <Slider
        value={time}
        onChange={setTime}
        min={min.valueOf()}
        max={session.end ? max.valueOf() : Date.now()}
        labelAlwaysOn
        label={(value) => new Date(value).toLocaleTimeString()}
        size={3}
      />
      <Button ml={8} size="small" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      </Button>
      {session.end && (
        <Button
          ml={8}
          size="small"
          onClick={() => {
            mutation.time = Date.now()
          }}
        >
          <FastForwardOutlined />
        </Button>
      )}
    </SliderContainer>
  )
}

const TimeHistogram = () => {
  const session = useRecoilValue(activeSession)
  const min = session && session.start ? new Date(session.start) : new Date()
  const max = session && session.end ? new Date(session.end) : new Date()

  return (
    <Card shadow="sm" style={{ height: '100%' }}>
      <Container>
        <LineChart min={min} max={max} isLive={session && !session.end} />
        {session && <TimeSlider session={session} min={min} max={max} />}
      </Container>
    </Card>
  )
}

export default TimeHistogram
