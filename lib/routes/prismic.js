const { GraphQLClient, gql } = require('graphql-request')
const axios = require('axios')
const express = require('express')
const router = express.Router()

const { PRISMIC_TOKEN, PRISMIC_APP, PRISMIC_PAGE_ID } = process.env

const query = gql`
  query content($id: String, $language: String = "en-us") {
    allPagecontents(id: $id, lang: $language) {
      edges {
        node {
          title
          description
          sessions_title
          sections {
            section_title
            text
          }
          guides {
            link {
              ... on Guide {
                title
                platform
                steps {
                  text
                  image
                }
              }
            }
          }
        }
      }
    }
  }
`

const getPrismicRef = async () => {
  const prismicInfo = (
    await axios.get(`https://${PRISMIC_APP}.cdn.prismic.io/api/v2`)
  ).data
  if (!prismicInfo.refs || !prismicInfo.refs.length) {
    throw new Error('prismic refs not found')
  }

  return prismicInfo.refs.find((r) => r.isMasterRef).ref
}

router.get('/', async (req, res) => {
  const { language = 'en-us' } = req.query

  try {
    const prismicRefId = await getPrismicRef()
    const client = new GraphQLClient(
      `https://${PRISMIC_APP}.prismic.io/graphql`,
      {
        headers: {
          authorization: `Token ${PRISMIC_TOKEN}`,
          'prismic-ref': prismicRefId,
        },
        method: 'GET',
      }
    )

    const data = await client.request(query, {
      id: PRISMIC_PAGE_ID,
      language,
    })

    res.send(data)
  } catch (e) {
    res.status(500)
    res.send({ error: e.message })
  }
})

module.exports = router
