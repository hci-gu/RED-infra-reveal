import React, { useEffect, useState } from 'react'
import {
  activeSession,
  delayedTime,
  packetsFilters,
  packetTimeBuckets,
  timeAtom,
} from '../state'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Line } from '@ant-design/charts'
import { Button, Slider, Space } from 'antd'
import {
  PauseOutlined,
  CaretRightOutlined,
  FastForwardOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import moment from 'moment'
import { debounce } from '../utils'

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

const LineChart = () => {
  const data = useRecoilValue(packetTimeBuckets)

  const config = {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    theme: 'dark',
  }

  return <Line {...config} />
}

let lastUpdate = new Date()
const TimeSlider = ({ session }) => {
  const [now, setNow] = useRecoilState(timeAtom)
  const [, setDelayedTime] = useRecoilState(delayedTime)
  const [isPlaying, setIsPlaying] = useState(session.end ? false : true)

  useEffect(() => {
    let interval = setInterval(() => {
      if (isPlaying && !!session.end) {
        setNow((now) => moment(now).add(100, 'milliseconds').valueOf())
      } else if (isPlaying) {
        setNow(moment().valueOf())
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, setNow])

  useEffect(() => {
    if (new Date().getTime() - lastUpdate > 1000) {
      setDelayedTime(now)
      lastUpdate = new Date()
    }
  }, [now])

  return (
    <SliderContainer>
      <Slider
        value={moment(now).valueOf()}
        onChange={(val) => setNow(val)}
        min={moment(session.start).valueOf()}
        max={moment(session.end ? session.end : new Date()).valueOf()}
        tooltipVisible
        tipFormatter={(value) => (
          <SliderHandle>{moment(value).format('HH:mm:ss')}</SliderHandle>
        )}
      ></Slider>
      <Space>
        <Button size="small" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </Button>
        {session.end && (
          <Button size="small" onClick={() => setNow(moment().valueOf())}>
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
