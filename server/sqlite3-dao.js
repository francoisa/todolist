"use strict"

const sha1 = require('sha1');
const assert = require('assert');
const http = require('http');
const express = require('express');
const app = express();
var sqlite3 = require('sqlite3').verbose();

function openDb() {
  const db = new sqlite3.Database('db\\todolistdb.sqlite3');
  return db;
}

export function UserDao() {
  if (!(this instanceof UserDao)) {
    return new UserDao();
  }
}

UserDao.prototype.list = function(cb) {
  const db = openDb();
  const sel_user = 'SELECT username, email, first_name, last_name FROM users';
  db.all(sel_user, function(err, rows) {
    var users = [];
    if (rows) {
      rows.forEach(function(u) {
        users.push({username: u.username, email: u.email,
            first_name: u.first_name, last_name: u.last_name});
      });
    }
    db.close();
    if (cb) {
      cb(null, users);
    }
    else {
      return users;
    }
  });
}

UserDao.prototype._authenticate = function(username, pwd, user, resolve, rejecct,
                                           cb) {
  const db = openDb();
  const sel_user = 'SELECT username, email, password, salt FROM users WHERE ' +
                   'username = ?';
  var stmt = db.prepare(sel_user);
  stmt.get(username, function(err, u) {
    if (err) {
      console.log("err: " + err);
    }
    if (u) {
      var password = sha1(pwd + u.salt);
      if (password === u.password) {
        user = {result: "SUCCESS", username: u.username, email: u.email,
            firstName: u.first_name, lastName: u.last_name};
      }
      else {
        console.log(password + ' !== ' + u.password);
      }
    }
    else {
      user = {result: "ERROR", code: "NOT_FOUND"};
    }
    stmt.finalize();
    db.close();
    if (cb) {
      cb(null, user);
    }
    else {
      console.log("user(" + id + "): " + JSON.stringify(user));
      if (err) {
        reject(user);
      }
      else {
        resolve(user);
      }
    }
  });
}
UserDao.prototype.authenticate = function(username, pwd, cb) {
  var user = {result: "ERROR", code: "INVALID_PASSWORD"};
  var _this = this;
  if (cb) {
    this._authenticate(username, pwd, user, null, null, cb);
  }
  else {
    return new Promise( function(resolve, reject) {
      _this._authenticate(username, pwd, user, resolve, reject);
    });
  }
}

UserDao.prototype._read = function(id, user, resolve, reject, cb) {
  const db = openDb();
  const sel_user = 'SELECT username, email, first_name, last_name ' +
                   'FROM users WHERE rowid = ?';
  var stmt = db.prepare(sel_user);
  stmt.get(id, function(err, u) {
    if (err) {
      console.log("err: " + err);
    }
    if (u) {
      user = {};
      user.id = id;
      user.username = u.username;
      user.email = u.email;
      user.firstName = u.first_name;
      user.lastName = u.last_name;
    }
    stmt.finalize();
    db.close();
    if (cb) {
      cb(null, user);
    }
    else {
      console.log("user(" + id + "): " + JSON.stringify(user));
      if (err) {
        reject(user);
      }
      else {
        resolve(user);
      }
    }
  })
}

UserDao.prototype.read = function(id, cb) {
  var user = {};
  user.result = "ERROR";
  user.code = "NOT_FOUND";
  var _this = this;
  if (cb) {
    this._read(id, user, null, null, cb);
  }
  else {
    return new Promise( function(resolve, reject) {
      _this._read(id, user, resolve, reject);
    });
  }
}

UserDao.prototype.update = function(username, params, cb) {
  console.log('Executing PUT /user');
  const db = openDb();
  const upd_user = "UPDATE users SET " + param_cql + " WHERE username = ?";
  var param_cql = "";
  var upd_params = [];
  var count = Object.keys(params).length;
  Object.keys(params).forEach (function(p) {
      count--;
      param_cql += p + " = ?";
      if (count !== 0) param_cql += ", ";
      upd_params.push(params[p]);
  });
  upd_params.push(username);
  var result = {result: "SUCCESS", username: "francoisa"};
  db.serialize(function() {
    var stmt = db.prepare(upd_user);
    stmt.run(upd_params);
    stmt.finalize();
  });
  db.close();
  if (cb) {
    cb(null, result);
  }
  else {
    return result;
  }
}

UserDao.prototype.create = function(params, cb) {
  const db = openDb();
  const ins_user = 'INSERT INTO users (username, salt, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)';
  var result = {result: "ERROR", code: "INVALID_USER"};
  db.serialize(function() {
    var stmt = db.prepare(ins_user);
    stmt.run(params);
    stmt.finalize();
    result = {username: content.username, email: content.email,
        first_name: content.first_name, last_name: content.last_name};
  });
  db.close();
  if (cb) {
    cb(null, result);
  }
  else {
    return result;
  }
}

UserDao.prototype.delete = function(id, cb) {
  const db = openDb();
  const del_user = 'DELETE FROM users WHERE username = ?';
  var result = {result: "SUCCESS", username: id};
  db.serialize(function() {
    var stmt = db.prepare(del_user);
    stmt.run(id);
    stmt.finalize();
  });
  db.close();
  if (cb) {
    cb(null, result);
  }
  else {
    return result;
  }
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
