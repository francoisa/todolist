"use strict"

const sha1 = require('sha1');
var sqlite3 = require('sqlite3').verbose();

function openDb() {
  const db = new sqlite3.Database('db\\todolistdb.sqlite3');
  return db;
}

const db_column_dict = {firstName: "first_name", lastName: "last_name"};

function toDbColumn(name) {
    if (name in db_column_dict) {
      return db_column_dict[name];
    }
    else {
      return name;
    }
}

export function UserDao() {
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

UserDao.prototype._authenticate = function(username, pwd, user, resolve, reject,
                                           cb) {
  const db = openDb();
  const sel_user = 'SELECT rowid, username, email, password, salt FROM users WHERE ' +
                   'username = ?';
  var stmt = db.prepare(sel_user);
  stmt.get(username, function(err, u) {
    if (err) {
      console.log("err: " + err);
    }
    if (u) {
      var password = sha1(pwd + u.salt);
      if (password === u.password) {
        user = {result: "SUCCESS", rowid: u.rowid, username: u.username, email: u.email};
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
      console.log("user(" + username + "): " + JSON.stringify(user));
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
  if (cb) {
    this._authenticate(username, pwd, user, null, null, cb);
  }
  else {
    var _this = this;
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
  if (cb) {
    this._read(id, user, null, null, cb);
  }
  else {
    var _this = this;
    return new Promise( function(resolve, reject) {
      _this._read(id, user, resolve, reject);
    });
  }
}

UserDao.prototype.update = function(username, params, cb) {
  if (cb) {
    this._update(username, params, null, cb);
  }
  else {
    var _this = this;
    return new Promise( function(resolve, reject) {
      _this._update(username, params, resolve);
    });
  }
}

UserDao.prototype._update = function(username, params, resolve, cb) {
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
    resolve(result);
  }
}

UserDao.prototype.updateById = function(rowid, params, cb) {
  if (cb) {
    this._updateById(rowid, params, cb);
  }
  else {
    var _this = this;
    _this._updateById(rowid, params);
  }
}

UserDao.prototype._updateById = function(rowid, params, cb) {
  const db = openDb();
  var upd_params = [];
  var count = Object.keys(params).length;
  var param_cql = "";
  Object.keys(params).forEach (function(p) {
      count--;
      param_cql += toDbColumn(p) + " = ?";
      if (count !== 0) param_cql += ", ";
      upd_params.push(params[p]);
  });
  const upd_user = "UPDATE users SET " + param_cql + " WHERE rowid = ?";
  upd_params.push(rowid);
  console.log("upd_user: '" + upd_user + "', params: " + JSON.stringify(upd_params));
  var result = {result: "SUCCESS", rowid: rowid};
  db.serialize(function() {
    var stmt = db.prepare(upd_user);
    stmt.run(upd_params);
    stmt.finalize();
  });
  db.close();
  console.log("result(" + rowid + "): " + JSON.stringify(result));
  if (cb) {
    cb(null, result);
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
