import { Grid, Card, Stack, Text } from '@mantine/core'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { filteredPackets, packetContentSize } from '../state/packets'
import { displayBytes } from '../utils'

const Statistics = () => {
  const totalContentSize = useRecoilValue(packetContentSize)
  const packets = useRecoilValue(filteredPackets)

  const responseTime =
    packets.reduce((acc, curr) => {
      if (curr.responseTime) {
        return acc + curr.responseTime
      }
      return acc
    }, 0) / packets.length

  return (
    <Card shadow="sm">
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack p={0} spacing={0}>
            <Text align="center" size="xs">
              Number of packets
            </Text>
            <Text align="center" size="xl">
              {packets.length}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack p={0} spacing={0}>
            <Text align="center" size="xs">
              Data amount
            </Text>
            <Text align="center" size="xl">
              {displayBytes(totalContentSize)}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack p={0} spacing={0}>
            <Text align="center" size="xs">
              Average response time
            </Text>
            <Text align="center" size="xl">{`${responseTime.toFixed(
              1
            )} ms`}</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

export default Statistics
