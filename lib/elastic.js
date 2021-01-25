const { Client } = require('@elastic/elasticsearch')
const elastic = new Client({ node: 'http://localhost:9200' })
const uuid = require('uuid').v4

const INDEX_NAME = 'packets'

const indexExists = async () => {
  const res = await elastic.indices.exists({ index: INDEX_NAME })
  return res.body
}

const insert = async (dataPoints) => {
  await elastic.bulk({
    index: INDEX_NAME,
    body: dataPoints.flatMap((doc) => [
      { index: { _index: INDEX_NAME, _id: `${doc.id}` } },
      {
        timestamp: new Date(),
        ...doc,
      },
    ]),
  })
}

module.exports = {
  init: async () => {
    if (await indexExists()) return
    await elastic.indices.create({ index: INDEX_NAME })
    await elastic.indices.putMapping({
      index: INDEX_NAME,
      body: {
        properties: {
          timestamp: { type: 'date' },
          host: { type: 'keyword' },
          ip: { type: 'keyword' },
          location: { type: 'geo_point' },
          country: { type: 'keyword' },
          city: { type: 'keyword' },
          timezone: { type: 'keyword' },
        },
      },
    })
  },
  save: async (packet) => {
    const transformed = {
      id: uuid(),
      host: packet.host,
      ip: packet.ip,
      location: {
        lat: packet.geo.ll[0],
        lon: packet.geo.ll[1],
      },
      city: packet.geo.city,
      country: packet.geo.country,
      timezone: packet.geo.timezone,
    }
    insert([transformed])
  },
}
