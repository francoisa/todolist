"use strict"

var sqlite3 = require('sqlite3').verbose();

function openDb() {
  const db = new sqlite3.Database('db\\todolistdb.sqlite3');
  return db;
}

export function TodoDao() {
}

TodoDao.prototype.read = function(id, cb) {
  const db = openDb();
  const sel_todos = 'SELECT rowid, content, status, username FROM todos WHERE rowid = ?';
  db.all(sel_todos, id, function(err, todos) {
    if (err) {
      todos = {status: "FAILURE", code: "QUERY_ERROR"};
      console.log("Error '" + err + "' in " + sel_todos)
    }
    else if (!todos) {
      console.log("No rows returned.")
    }
    db.close();
    if (cb) {
      cb(null, todos);
    }
    else {
      return todos;
    }
  });
}

TodoDao.prototype.list = function(username, cb) {
  const db = openDb();
  const sel_todos = 'SELECT rowid, content, status FROM todos WHERE username = ?';
  db.all(sel_todos, username, function(err, todos) {
    if (err) {
      todos = {status: "FAILUE", code: "QUERY_ERROR"};
      console.log("Error '" + err + "' in " + sel_todos)
    }
    else if (!todos) {
      console.log("No rows returned.")
    }
    db.close();
    if (cb) {
      cb(null, todos);
    }
    else {
      return todos;
    }
  });
}

TodoDao.prototype.create = function(params, cb) {
  const ins_todo = 'INSERT INTO todos (username, content, status) VALUES (?, ?, ?)';
  const db = openDb();
  var result = {status: "FAILURE", code: "INSERT_FAILED"};
  db.serialize(function() {
    var stmt = db.prepare(ins_todo);
    stmt.run(params);
    stmt.finalize();
    result = {username: params[0], content: params[1],
              status: params[2]};
  });
  db.close();
  if (cb) {
    cb(null, result);
  }
}

TodoDao.prototype.update = function(params, cb) {
  const upd_todo = 'UPDATE todos SET content = ?, status = ? WHERE rowid = ?';
  const db = openDb();
  var result = {status: "FAILURE", code: "UPDATE_FAILED"};
  db.serialize(function() {
    var stmt = db.prepare(upd_todo);
    stmt.run(params);
    stmt.finalize();
    result = {status: "SUCCESS"};
  });
  db.close();
  if (cb) {
    cb(null, result);
  }
  else {
    return result;
  }
}

TodoDao.prototype.delete = function(id, cb) {
  const del_todo = 'DELETE FROM todos WHERE rowid = ?';
  const db = openDb();
  var todo = {status: "FAILURE", code: "DELETE_FAILED"};
  db.serialize(function() {
    var stmt = db.prepare(del_todo);
    stmt.run(id);
    stmt.finalize();
    todo = {status: "SUCCESS"};
  });
  db.close();
  if (cb) {
    cb(null, todo);
  }
  else {
    return todo;
  }
}
