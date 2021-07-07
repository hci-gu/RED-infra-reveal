import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { useSocket } from './hooks/socket'
import ProxyGuide from './pages/ProxyGuide'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import * as api from './hooks/api'

const DashboardWrapper = () => {
  useSocket()
  return <Dashboard />
}

const App = () => {
  api.useSessions()

  return (
    <Router>
      <Switch>
        <Route path="/session/:id">
          <DashboardWrapper />
        </Route>
        <Route path="/proxy-guide">
          <ProxyGuide />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
