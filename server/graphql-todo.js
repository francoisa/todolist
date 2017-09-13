var sqlite3 = require('sqlite3').verbose();

export function Todo(database) {
  this.database = database;
  this.todoDb = {};
}

Todo.prototype.collaborators = function({id}) {
  var todo = {
    title: 'say hello',
    details: 'talk to someone',
    status: 'open',
    categories: ['test'],
    collaborators: ['wasidah@gmail.com']
  }
  var user = {
    email: email,
    password: pwd,
    items: [todo]
  };
  return [user];
}

Todo.prototype.itemsByCategory = function({category}) {
  var todo = {
    title: 'say hello',
    details: 'talk to someone',
    status: 'open',
    categories: ['test'],
    collaborators: ['wasidah@gmail.com']
  }
  return [todo];
}

Todo.prototype.addId = function(id, obj) {
  obj.id = id;
  return obj;
}

Todo.prototype.create = function(user, {userId, input}) {
  var id = input.title.hashCode();
  if (id in this.todoDb) {
    throw new Error('title "' + input.title + '" already in db');
  }
  else {
    this.todoDb[id] = input;
    let todo = this.addId(id, this.todoDb[id]);
    user.get(userId).items.push(todo);
    return todo;
  }
}

Todo.prototype.update = function({id, input}) {
  var id = input.title.hashCode();
  if (id in this.todoDb) {
    this.todoDb[id] = input;
    return this.addId(id, this.todoDb[id]);
  }
  else {
    throw new Error('title "' + input.title + '" not in db');
  }
}
