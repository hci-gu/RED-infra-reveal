import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'
import App from './App'
import { useSocket } from './hooks/socket'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

const Root = () => {
  useSocket()
  return (
    <Container>
      <App />
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Root />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
