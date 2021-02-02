import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { createClient, Provider } from 'urql'
import App from './App'
import 'antd/dist/antd.less'

const client = createClient({
  url: 'http://localhost:4000/admin/api',
})

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
