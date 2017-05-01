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

  rest.get('/user/authenticate/:id/:pwd', function(req, content, cb) {
    console.log('Executing GET /user/authenticate/:id/:pwd');
    var id = req.params.id;
    var pwd = req.params.pwd;
    const db = openDb();
    const sel_user = 'SELECT username, email, password, salt FROM users WHERE username = ?';
    var user = {result: "ERROR", code: "INVALID_PASSWORD"};
    db.serialize(function() {
      db.each(sel_user, function(err, u) {
        var password = sha1(pwd + u.salt);
        if (password === u.password.toString("hex")) {
          user = {result: "SUCCESS", username: u.username, email: u.email,
              first_name: u.first_name, last_name: u.last_name};
        }
      });
    });
    db.close();
    cb(null, user);
  });

  rest.get('/user/:id', function(req, content, cb) {
    console.log('Executing GET /user/:id');
    var id = req.params.id;
    const db = openDb();
    const sel_user = 'SELECT username, email, first_name, last_name FROM users WHERE username = ?';
    var user = {result: "ERROR", code: "NOT_FOUND"};
    db.serialize(function() {
      db.each(sel_user, function(err, u) {
        user = {username: u.username, email: u.email,
            first_name: u.first_name, last_name: u.last_name};
      });
    });
    db.close();
    cb(null, user);
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
    var params = [];
    params.push(content.username);
    var salt = Date.now();
    params.push(salt);
    var password = sha1(content.password + salt);
    var pwdBuffer = Buffer.from(password, "hex");
    params.push(pwdBuffer);
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

  rest.del('/user/:id', function(req, content, cb) {
    console.log('Executing DELETE /user/:id');
    var id = req.params.id;
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
    var username = req.params.user;
    const sel_todos = 'SELECT id, content FROM todos WHERE username = ?';
    var rows = [];
    db.serialize(function() {
      db.each(sel_user, function(err, u) {
        rows.push({username: u.username, email: u.email,
            first_name: u.first_name, last_name: u.last_name});
      });
    });
    db.close();
    cb(null, rows);
  });

  rest.post('/todo/:user', function(req, content, cb) {
    const ins_todo = 'INSERT INTO todos (username, content, status) VALUES (?, ?, ?)';
    var params = [];
    params.push(content.username);
    params.push(content.content);
    params.push(content.status);
    db.serialize(function() {
      var stmt = db.prepare(ins_todo);
      stmt.run(params);
      stmt.finalize();
      user = {username: content.username, email: content.email,
          first_name: content.first_name, last_name: content.last_name};
    });
    db.close();
    cb(null, user);
  });
}

function getDispatcher (rest) {
	return rest.dispatcher( 'GET', '/dispatcher/:subject', function (req, res, next) {
		res.end( 'Dispatch call made:' + req.params.subject )
	} )
}

exports.buildUpRestAPI = buildUpRestAPI;
exports.getDispatcher = getDispatcher;
