import * as Structure from 'sanity-plugin-intl-input/lib/structure'

// default implementation by re-exporting
export const getDefaultDocumentNode = Structure.getDefaultDocumentNode
export default Structure.default

// or manual implementation to use with your own custom desk structure
// export const getDefaultDocumentNode = (props) => {
//   if (props.schemaType === 'myschema') {
//     return S.document().views(
//       Structure.getDocumentNodeViewsForSchemaType(props.schemaType)
//     )
//   }
//   return S.document()
// }

// export default () => {
//   const items = Structure.getFilteredDocumentTypeListItems()
//   return S.list().id('__root__').title('Content').items(items)
// }
