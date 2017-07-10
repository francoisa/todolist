"use strict"

let initSqlite3 = require('./init-sqlite3');
let start = require('./rest-server');
let graphql_start = require('./graphql-server');

console.log("process.env.SERVER: '" + process.env.SERVER + "'");
let server_type = process.env.SERVER || 'rest';

if (server_type === 'graphql') {
  start = graphql_start;
}

initSqlite3.createDb(start.start);
