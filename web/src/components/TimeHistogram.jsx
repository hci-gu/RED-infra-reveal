import React, { useEffect, useState } from 'react'
import { activeSession, settingsAtom } from '../state'
import { mutationAtom } from '../state/packets'
import { useRecoilValue } from 'recoil'
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

const SliderHandle = styled.div`
  display: flex;
  justify-content: center;
`

const packetsToBuckets = (packets) => {
  const buckets = packets.reduce((acc, curr) => {
    const time = new Date(curr.timestamp)
    const seconds = time.getSeconds()
    const remainder = 15 - (seconds % 15)

    time.setSeconds(seconds + remainder)
    const key = time.toLocaleTimeString()
    if (!acc[key]) {
      acc[key] = {
        date: time,
        value: 1,
      }
    } else {
      acc[key].value++
    }
    return acc
  }, {})

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

const LineChart = ({ min, max }) => {
  const [graph, setGraph] = useState()
  const mutation = useRecoilValue(mutationAtom)
  const { darkMode } = useRecoilValue(settingsAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      graph.changeData([
        { time: min, value: 0 },
        ...packetsToBuckets(mutation.packets),
        { time: max, value: 0 },
      ])
    }, 1000)
    return () => clearInterval(interval)
  }, [graph])

  const config = {
    data: packetsToBuckets(mutation.packets),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      tickCount: 10,
    },
    theme: darkMode ? 'dark' : 'light',
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
  const [time, setTime] = useState(Date.now())
  const [isPlaying, setIsPlaying] = useState(session.end ? false : true)

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
    mutation.recentPackets = mutation.packets.filter((p) => {
      const diff = mutation.time - new Date(p.timestamp)
      return diff < 15000
    })
  }, [time])

  return (
    <SliderContainer>
      <Slider
        value={time}
        onChange={setTime}
        min={min.valueOf()}
        max={max.valueOf()}
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
        <LineChart min={min} max={max} />
        {session && <TimeSlider session={session} min={min} max={max} />}
      </Container>
    </Card>
  )
}

export default TimeHistogram
