"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;
var start;

function createDb(startServer) {
    console.log("createDb");
    start = startServer;
    db = new sqlite3.Database('db\\todolistdb.sqlite3', createUsersTable);
}


function createUsersTable() {
    console.log("createUsersTable");
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, " +
           "salt TEXT, email TEXT, first_name TEXT, last_name TEXT),)",
           createTodosTable);
}

function createTodosTable() {
    console.log("createTodosTable");
    db.run("CREATE TABLE IF NOT EXISTS todos (content TEXT, status TEXT, " +
    "created DATE, username TEXT)", closeDb);
}

function closeDb() {
    console.log("closeDb");
    db.close();
    start();
}

exports.createDb = createDb;
