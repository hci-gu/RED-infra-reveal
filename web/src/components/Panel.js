import { Card } from 'antd'
import React from 'react'
import styled from 'styled-components'

const PanelContainer = styled.div`
  /* border: 3px dashed red;
  height: 300px; */
`

const Panel = ({ children }) => {
  return (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <PanelContainer>{children}</PanelContainer>
    </Card>
  )
}

export default Panel
