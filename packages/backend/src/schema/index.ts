import { loadSchemaSync, GraphQLFileLoader } from 'graphql-tools';
import { join } from 'path';

export const schema = loadSchemaSync(
  join(__dirname, 'schema.graphql'),
  { loaders: [new GraphQLFileLoader()] },
);
