var sqlite3 = require('sqlite3').verbose();

export function User(database) {
  this.database = database;
  this.userDb = {};
}

User.prototype.addId = function(id, obj) {
  var copy = Object.assign({}, obj);
  copy.id = id;
  delete copy.password;
  return copy;
}

User.prototype.login = function({email, pwd}) {
  const db = new sqlite3.Database(this.database);
  db.close();
  var id = email.hashCode();
  if (id in this.userDb) {
    let user = this.userDb[id];
    if (user.password === pwd) {
      var copy = this.addId(id, user);
      return copy;
    }
    else {
      throw new Error('Invalid password for email ' + email);
    }
  }
  else {
    throw new Error('email ' + email + ' not found');
  }
}

User.prototype.create = function({input}) {
    var id = input.email.hashCode();
    if (id in this.userDb) {
      throw new Error('email ' + input.email + ' already in db');
    }
    else {
      this.userDb[id] = input;
      this.userDb[id].items = [];
      return this.addId(id, this.userDb[id]);
    }
  }

User.prototype.update = function({id, input}) {
  var id = input.email.hashCode();
  if (id in this.userDb) {
    this.userDb[id] = input;
    return addId(id, input);
  }
  else {
    throw new Error('email ' + input.email + ' not in db');
  }
}

User.prototype.get = function(id) {
  return this.userDb[id];
}
