"use strict"

const sha1 = require('sha1');
const assert = require('assert');
const http = require('http');
const express = require('express');
const app = express();

var { UserDao, TodoDao } = require('./sqlite3-dao');

const user = new UserDao();
const todo = new TodoDao();

function buildUpRestAPI(rest) {
  rest.get('/users', function(req, content, cb) {
    console.log('Executing GET /users');
    var users = user.list();
    cb(null, users);
  });

  rest.get('/authenticate/:id/:pwd', function(req, content, cb) {
    console.log('Executing GET /authenticate/:id/:pwd');
    user.authenticate(req.params.id, req.params.pwd, cb);
  });

  rest.get('/user/:id', function(req, content, cb) {
    console.log('Executing GET /user/:id');
    user.read(req.params.id, cb);
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
    user.update(content.username, params, cb);
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
    user.create(params, cb);
  });

  rest.del('/user/:user', function(req, content, cb) {
    console.log('Executing DELETE /user/:id');
    const id = req.params.user;
    user.delete(id, cb);
  });

  rest.get('/todo/:user', function(req, content, cb) {
    console.log('Executing GET /todo/:user');
    todo.list(req.params.user, cb);
  });

  rest.post('/todo/:user', function(req, content, cb) {
    console.log('Executing POST /todo/:user');
    var params = [];
    const username = req.params.user;
    params.push(username);
    params.push(content.content);
    params.push(content.status);
    todo.create(params, cb);
  });

  rest.put('/todo/:id', function(req, content, cb) {
    console.log('PUT /todo/:user');
    var params = [];
    const id = req.params.id;
    params.push(content.content);
    params.push(content.status);
    params.push(id);
    todo.update(params, cb);
  });

  rest.del('/todo/:id', function(req, content, cb) {
    console.log('DELETE /todo/:user');
    todo.delete(req.params.id, cb);
  });
}

function getDispatcher (rest) {
	return rest.dispatcher( 'GET', '/dispatcher/:subject', function (req, res, next) {
		res.end('Dispatch call made:' + req.params.subject);
	} )
}

exports.buildUpRestAPI = buildUpRestAPI;
exports.getDispatcher = getDispatcher;
