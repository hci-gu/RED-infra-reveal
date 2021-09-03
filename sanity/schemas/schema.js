// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import supportedLanguages from './supportedLanguages'

// We import object and document schemas
// Objects
import blockContent from './objects/blockContent'
// Documents
import landingPage from './documents/landingPage'
import section from './documents/section'
import guide from './documents/guide'
import guideImage from './documents/guideImage'

const addLocalizationToDocumentType = (schemaType) => {
  if (schemaType.type !== 'document') {
    return schemaType
  }

  return {
    ...schemaType,
    i18n: {
      ...schemaType.i18n,
      base: supportedLanguages[0],
      languages: supportedLanguages,
      // change the names of the default fields
      fieldNames: {
        lang: 'i18n_lang',
        references: 'i18n_refs',
      },
    },
    // add the fields in so we can query with them on graphql
    fields: [
      ...schemaType.fields,
      {
        name: 'i18n_lang',
        type: 'string',
        hidden: true,
      },
      {
        name: 'i18n_refs',
        type: 'array',
        hidden: true,
        of: [
          {
            type: 'i18n_refs_object',
          },
        ],
      },
    ],
  }
}

const addLocalizationToSchemaType = (schemaType) => {
  if (schemaType.type === 'object') {
    return schemaType
  } else {
    return addLocalizationToDocumentType(schemaType)
  }
}

const customSchemaTypes = [landingPage, section, guide, guideImage]

const i18n_refs_object = {
  name: 'i18n_refs_object',
  type: 'object',
  fields: [
    {
      type: 'string',
      name: 'lang',
    },
    {
      type: 'reference',
      name: 'ref',
      // map over all the custom values to create a dynamic array of types which should be referenced
      to: customSchemaTypes
        .map((customSchema) =>
          customSchema?.type === 'document' ? { type: customSchema.name } : null
        )
        .filter(Boolean),
    },
  ],
}

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(
    [
      // The following are document types which will appear
      // in the studio.
      // When added to this list, object types can be used as
      // { type: 'typename' } in other document schemas
      blockContent,
      ...customSchemaTypes,
      i18n_refs_object,
    ].map((schema) => addLocalizationToSchemaType(schema))
  ),
})
