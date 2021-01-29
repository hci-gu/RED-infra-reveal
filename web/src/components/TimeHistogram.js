import React, { useEffect, useRef } from 'react'
import moment from 'moment'
import { packetsAtom, packetsFilters, packetTimeBuckets } from '../state'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Line } from '@ant-design/charts'
import { debounce } from '../utils'

const TimeHistogram = () => {
  const [filter, setFilter] = useRecoilState(packetsFilters)
  const data = useRecoilValue(packetTimeBuckets)
  const ref = useRef()

  const onSliderChange = (val) => {
    console.log('SLIDER', val)
    setFilter({
      ...filter,
      timeRange: val,
    })
  }

  useEffect(() => {
    if (ref.current) {
      const { chart } = ref.current
      const chartOnChange = chart.controllers[4].onChangeFn
      function onChange(e) {
        onSliderChange(e)
        chartOnChange(e)
      }
      chart.controllers[4].onChangeFn = debounce(onChange, 100)
      console.log(chart.getEvents())
      ref.current.on('click', () => {
        console.log(chart)
      })
    }
  }, [])

  const config = {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: { tickCount: 5 },
    slider: {
      start: 0,
      end: 1,
    },
    theme: 'dark',
  }

  return <Line {...config} chartRef={ref} />
}

export default TimeHistogram
