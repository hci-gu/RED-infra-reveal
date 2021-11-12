import React, { useEffect, useMemo, useState } from 'react'
import { activeSession, mutationAtom } from '../state'
import { useRecoilValue } from 'recoil'
import { Line } from '@ant-design/charts'
import { Button, Slider, Space } from 'antd'
import {
  PauseOutlined,
  CaretRightOutlined,
  FastForwardOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'

const Container = styled.div`
  height: 180px;
`

const SliderContainer = styled.div`
  width: 100%;
  display: flex;

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

const LineChart = () => {
  const [graph, setGraph] = useState()
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      graph.changeData(packetsToBuckets(mutation.packets))
    }, 1000)
    return () => clearInterval(interval)
  }, [graph])

  const config = {
    data: packetsToBuckets(mutation.packets),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    theme: 'dark',
  }

  return <Line {...config} onReady={setGraph} />
}

const TIME_INC = 100
const TimeSlider = ({ session }) => {
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

  const min = session.start ? new Date(session.start) : new Date()
  const max = session.end ? new Date(session.end) : new Date()

  return (
    <SliderContainer>
      <Slider
        value={time}
        onChange={setTime}
        min={min.valueOf()}
        max={max.valueOf()}
        tooltipVisible
        tipFormatter={(value) => (
          <SliderHandle>{new Date(value).toLocaleTimeString()}</SliderHandle>
        )}
      ></Slider>
      <Space>
        <Button size="small" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </Button>
        {session.end && (
          <Button
            size="small"
            onClick={() => {
              mutation.time = Date.now()
            }}
          >
            <FastForwardOutlined />
          </Button>
        )}
      </Space>
    </SliderContainer>
  )
}

const TimeHistogram = () => {
  const session = useRecoilValue(activeSession)

  return (
    <Container>
      <LineChart />
      {session && <TimeSlider session={session} />}
    </Container>
  )
}

export default TimeHistogram
