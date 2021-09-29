const axios = require('axios')
const express = require('express')
const router = express.Router()

const { DIGITAL_OCEAN_TOKEN, FIREWALL_ID } = process.env
const PROXY_PORT = '8888'
const api = axios.create({
  baseURL: 'https://api.digitalocean.com/v2',
  headers: {
    Authorization: `Bearer ${DIGITAL_OCEAN_TOKEN}`,
  },
})

const getFireWall = async () => {
  const response = await api.get(`/firewalls/${FIREWALL_ID}`)
  return response.data.firewall
}

const getCurrentListFromFirewall = (firewall) => {
  const rule = firewall.inbound_rules.find((rule) => rule.ports === PROXY_PORT)

  if (rule) {
    return rule.sources.addresses
  }
  return []
}

const isAlreadyAdded = async (ip, cachedFirewall) => {
  const firewall = cachedFirewall ? cachedFirewall : await getFireWall()
  const list = getCurrentListFromFirewall(firewall)
  return list.indexOf(ip) !== -1
}

router.post('/is-added', async (req, res) => {
  const { ip } = req.body
  isAdded = await isAlreadyAdded(ip)

  res.send(isAdded)
})

router.post('/allow-list', async (req, res) => {
  const { ip } = req.body

  const firewall = await getFireWall()

  if (await isAlreadyAdded(ip, firewall)) {
    res.status(400)
    res.send({ error: 'already added' })
    return
  }

  const list = getCurrentListFromFirewall(firewall)

  const updated = {
    ...firewall,
    inbound_rules: [
      ...firewall.inbound_rules.filter((rule) => rule.ports !== PROXY_PORT),
      {
        protocol: 'tcp',
        ports: PROXY_PORT,
        sources: {
          addresses: [...list, ip],
        },
      },
    ],
  }

  try {
    await api.put(`/firewalls/${FIREWALL_ID}`, updated)
    res.send({
      message: 'success',
    })
  } catch (e) {
    res.status(400)
    res.send({
      error: e.message,
    })
  }
})

router.delete('/allow-list', async (req, res) => {
  const { ip } = req.body
  const firewall = await getFireWall()

  const list = getCurrentListFromFirewall(firewall)

  const updated = {
    ...firewall,
    inbound_rules: [
      ...firewall.inbound_rules.filter((rule) => rule.ports !== PROXY_PORT),
      {
        protocol: 'tcp',
        ports: PROXY_PORT,
        sources: {
          addresses: list.filter((address) => address !== ip),
        },
      },
    ],
  }

  try {
    await api.put(`/firewalls/${FIREWALL_ID}`, updated)
    res.send({
      message: 'success',
    })
  } catch (e) {
    res.status(400)
    res.send({
      error: e.message,
    })
  }
})

module.exports = router
