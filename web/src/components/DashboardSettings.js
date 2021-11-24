import { SettingOutlined } from '@ant-design/icons'
import { Col, Popover, Row, Switch } from 'antd'
import React from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { settingsAtom } from '../state'

const Container = styled.div`
  margin-left: 16px;
  font-size: 24px;
`

const SettingsPanel = () => {
  const [settings, setSettings] = useRecoilState(settingsAtom)
  return (
    <div>
      <h2>Settings</h2>
      <Row gutter={24}>
        <Col>Flip Map</Col>
        <Col>
          <Switch
            checked={settings.flipMap}
            onChange={() =>
              setSettings({ ...settings, flipMap: !settings.flipMap })
            }
          />
        </Col>
      </Row>
    </div>
  )
}

const DashboardSettings = () => {
  return (
    <Container>
      <Popover content={SettingsPanel} trigger="click">
        <SettingOutlined />
      </Popover>
    </Container>
  )
}

export default DashboardSettings
