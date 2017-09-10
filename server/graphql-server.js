import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {root, schema} from './graphql-schema';

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/graphql', graphQLHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  pretty: true}));

function start() {
  graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
  ));
}

exports.start = start;
