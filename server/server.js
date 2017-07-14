"use strict"
import path from 'path';
import { createDb } from './init-sqlite3';
import { rest_start } from './rest-server';
import { graphql_start } from './graphql-server';

console.log("process.env.SERVER: '" + process.env.SERVER + "'");
let server_type = process.env.SERVER || 'rest';

if (server_type === 'graphql') {
  createDb(graphql_start);
}
else {
  createDb(rest_start);
}
