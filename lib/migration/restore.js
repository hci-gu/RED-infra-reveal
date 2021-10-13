const fs = require('fs')
const { keystone } = require('../keystone')
const {
  getItems,
  createItems,
} = require('@keystonejs/server-side-graphql-client')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { promiseSeries } = require('./utils')

const lists = JSON.parse(fs.readFileSync('./tmp.json'))
let createdItems = {}

const mapTag = (tag) => {
  const doc = {
    name: tag.name,
  }

  if (tag.domains) {
    let domains = []
    tag.domains.forEach(({ name }) => {
      const { id } = createdItems.MainDomain.find((d) => d.name === name)
      domains.push({ id })
    })

    doc.domains = {
      connect: domains,
    }
  }
  if (tag.tagType) {
    const { id } = createdItems.Category.find(
      (d) => d.name === tag.tagType.name
    )
    doc.tagType = {
      connect: {
        id,
      },
    }
  }
  return { data: doc }
}

const mapMainDomain = (mainDomain) => {
  const doc = {
    name: mainDomain.name,
  }

  if (mainDomain.domains) {
    let domains = []
    mainDomain.domains.forEach(({ name }) => {
      const { id } = createdItems.Domain.find((d) => d.name === name)
      domains.push({ id })
    })

    doc.domains = {
      connect: domains,
    }
  }

  return { data: doc }
}

const restoreList = async ({ listKey, items }) => {
  const data = await createItems({
    keystone,
    listKey,
    items: items.map((i) => {
      switch (listKey) {
        case 'Tag':
          return mapTag(i)
        case 'MainDomain':
          return mapMainDomain(i)
        default:
          return {
            data: i,
          }
      }
    }),
    returnFields: 'name, id',
  })
  createdItems[listKey] = data
}

const run = async () => {
  await keystone.connect()
  await keystone.prepare({
    apps: [new GraphQLApp()],
  })
  await promiseSeries(lists, restoreList)
  process.exit(0)
}

run()
