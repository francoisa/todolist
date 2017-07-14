import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {schema} from './graphql-schema';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();

export function graphql_start() {
  graphQLServer.use('/', graphQLHTTP({schema, graphiql: true, pretty: true}));
  graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
  ));
  // Serve the Relay app
  const compiler = webpack({
    entry: ['whatwg-fetch', path.resolve(__dirname, '../src', 'index.js')],
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: 'babel-loader',
          test: /\.js$/,
        },
      ],
    },
    output: {filename: 'index.js', path: '/'},
  });

  const app = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/src/',
    stats: {colors: true},
  });
  const APP_PORT = 3000;
  // Serve static resources
  app.use('/', express.static(path.resolve(__dirname, 'public')));
  app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
}
