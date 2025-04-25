import { type SchemaTypeDefinition } from 'sanity'
import about from './about'
import staticPage from './staticPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, staticPage],
}
