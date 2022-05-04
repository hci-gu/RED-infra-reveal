import { SettingOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { Grid, Group, Popover, Text, Switch } from '@mantine/core'
import { settingsAtom } from '../state'

const SettingsPanel = () => {
  const [settings, setSettings] = useRecoilState(settingsAtom)
  return (
    <Grid>
      <Grid.Col>
        <Text>Settings</Text>
      </Grid.Col>
      <Grid.Col>
        <Group>
          <Text>Dark mode</Text>
          <Switch
            checked={settings.darkMode}
            onChange={() =>
              setSettings({ ...settings, darkMode: !settings.darkMode })
            }
          />
        </Group>
      </Grid.Col>
      <Grid.Col>
        <Group>
          <Text>Flip Map</Text>
          <Switch
            checked={settings.flipMap}
            onChange={() =>
              setSettings({ ...settings, flipMap: !settings.flipMap })
            }
          />
        </Group>
      </Grid.Col>
      <Grid.Col>
        <Group>
          <Text>Focus on map</Text>
          <Switch
            checked={settings.focusOnMap}
            onChange={() =>
              setSettings({ ...settings, focusOnMap: !settings.focusOnMap })
            }
          />
        </Group>
      </Grid.Col>
    </Grid>
  )
}

const DashboardSettings = () => {
  const [opened, setOpened] = useState(false)
  return (
    <Popover
      trigger="click"
      opened={opened}
      onClose={() => setOpened(false)}
      target={<SettingOutlined onClick={() => setOpened(!opened)} />}
      position="bottom"
      width={250}
      withArrow
    >
      <SettingsPanel />
    </Popover>
  )
}

export default DashboardSettings
