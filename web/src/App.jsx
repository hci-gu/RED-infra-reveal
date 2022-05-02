import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// import ProxyGuide from './pages/ProxyGuide'
// import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/session/:id" element={<Dashboard />} />
        <Route path="/proxy-guide" element={<ProxyGuide />} /> */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
