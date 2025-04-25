import { type SchemaTypeDefinition } from 'sanity'
import staticPage from './staticPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [staticPage],
}
