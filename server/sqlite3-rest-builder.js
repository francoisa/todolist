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

function buildUpRestAPI(rest) {
  rest.get('/users', function(req, content, cb) {
    console.log('Executing GET /users');
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
      cb(null, users);
    });
  });

  rest.get('/authenticate/:id/:pwd', function(req, content, cb) {
    console.log('Executing GET /authenticate/:id/:pwd');
    var id = req.params.id;
    const db = openDb();
    const sel_user = 'SELECT username, email, password, salt FROM users WHERE ' +
                     'username = ?';
    var user = {result: "ERROR", code: "INVALID_PASSWORD"};
    var stmt = db.prepare(sel_user);
    stmt.get(id, function(err, u) {
      if (err) {
        console.log("err: " + err);
      }
      if (u) {
        var password = sha1(req.params.pwd + u.salt);
        if (password === u.password) {
          user = {result: "SUCCESS", username: u.username, email: u.email,
              first_name: u.first_name, last_name: u.last_name};
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
      cb(null, user);
    });
  });

  rest.get('/user/:id', function(req, content, cb) {
    console.log('Executing GET /user/:id');
    var id = req.params.id;
    const db = openDb();
    const sel_user = 'SELECT username, email, first_name, last_name ' +
                     'FROM users WHERE username = ?';
    var user = {result: "ERROR", code: "NOT_FOUND"};
    var stmt = db.prepare(sel_user);
    stmt.get(id, function(err, u) {
      if (err) {
        console.log("err: " + err);
      }
      if (u) {
        user = {username: u.username, email: u.email,
            first_name: u.first_name, last_name: u.last_name};
      }
      stmt.finalize();
      db.close();
      cb(null, user);
    });
  });

  rest.put('/user', function(req, content, cb) {
    console.log('Executing PUT /user');
    var params = {};
    if (content.password) {
      params['password'] = content.password;
    }
    else {
      params['email'] = content.email;
      params['first_name'] = content.first_name;
      params['last_name'] = content.last_name;
    }
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
    upd_params.push(content.username);
    var user = {result: "SUCCESS", username: "francoisa"};
    db.serialize(function() {
      var stmt = db.prepare(upd_user);
      stmt.run(upd_params);
      stmt.finalize();
    });
    db.close();
    cb(null, user);
  });

  rest.post('/user', function(req, content, cb) {
    console.log('Executing POST /user');
    const db = openDb();
    var params = [];
    params.push(content.username);
    var salt = Date.now() + '';
    params.push(salt);
    var password = sha1(content.password + salt);
    params.push(password);
    params.push(content.email);
    params.push(content.first_name);
    params.push(content.last_name);
    const ins_user = 'INSERT INTO users (username, salt, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)';
    var user = {result: "ERROR", code: "INVALID_USER"};
    db.serialize(function() {
      var stmt = db.prepare(ins_user);
      stmt.run(params);
      stmt.finalize();
      user = {username: content.username, email: content.email,
          first_name: content.first_name, last_name: content.last_name};
    });
    db.close();
    cb(null, user);
  });

  rest.del('/user/:user', function(req, content, cb) {
    console.log('Executing DELETE /user/:id');
    const db = openDb();
    const id = req.params.user;
    const del_user = 'DELETE FROM users WHERE username = ?';
    var user = {result: "SUCCESS", username: id};
    db.serialize(function() {
      var stmt = db.prepare(del_user);
      stmt.run(id);
      stmt.finalize();
    });
    db.close();
    cb(null, user);
  });

  rest.get('/todo/:user', function(req, content, cb) {
    console.log('Executing GET /todo/:user');
    const db = openDb();
    const username = req.params.user;
    const sel_todos = 'SELECT rowid, content, status FROM todos WHERE username = ?';
    var rows = [];
    db.all(sel_todos, username, function(err, todos) {
      if (err) {
        todos = {status: "FAILUE", code: "QUERY_ERROR"};
        console.log("Error '" + err + "' in " + sel_todos)
      }
      else if (!todos) {
        console.log("No rows returned.")
      }
      db.close();
      cb(null, todos);
    });
  });

  rest.post('/todo/:user', function(req, content, cb) {
    console.log('Executing POST /todo/:user');
    const ins_todo = 'INSERT INTO todos (username, content, status) VALUES (?, ?, ?)';
    const db = openDb();
    var params = [];
    const username = req.params.user;
    params.push(username);
    params.push(content.content);
    params.push(content.status);
    var todo = {status: "FAILURE", code: "INSERT_FAILED"};
    db.serialize(function() {
      var stmt = db.prepare(ins_todo);
      stmt.run(params);
      stmt.finalize();
      todo = {username: username, content: content.content,
              status: content.status};
    });
    db.close();
    cb(null, todo);
  });

  rest.put('/todo/:id', function(req, content, cb) {
    console.log('PUT /todo/:user');
    const upd_todo = 'UPDATE todos SET content = ?, status = ? WHERE rowid = ?';
    const db = openDb();
    var params = [];
    const id = req.params.id;
    params.push(content.content);
    params.push(content.status);
    params.push(id);
    var todo = {status: "FAILURE", code: "UPDATE_FAILED"};
    db.serialize(function() {
      var stmt = db.prepare(upd_todo);
      stmt.run(params);
      stmt.finalize();
      todo = {status: "SUCCESS"};
    });
    db.close();
    cb(null, todo);
  });

  rest.del('/todo/:id', function(req, content, cb) {
    console.log('DELETE /todo/:user');
    const del_todo = 'DELETE FROM todos WHERE rowid = ?';
    const db = openDb();
    const id = req.params.id;
    var todo = {status: "FAILURE", code: "DELETE_FAILED"};
    db.serialize(function() {
      var stmt = db.prepare(del_todo);
      stmt.run(id);
      stmt.finalize();
      todo = {status: "SUCCESS"};
    });
    db.close();
    cb(null, todo);
  });
}

function getDispatcher (rest) {
	return rest.dispatcher( 'GET', '/dispatcher/:subject', function (req, res, next) {
		res.end( 'Dispatch call made:' + req.params.subject )
	} )
}

exports.buildUpRestAPI = buildUpRestAPI;
exports.getDispatcher = getDispatcher;
