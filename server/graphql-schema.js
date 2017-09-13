import {buildSchema} from 'graphql';

import {User} from './graphql-user';
import {Todo} from './graphql-todo';

//let todo = new Todo();
//let user = new User();

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        let c = this.charCodeAt(i);
        hash = ((hash<<5) - hash) + c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

export const schema = buildSchema(`
  type Todo {
    id: ID!
    title: String
    details: String
    status: String
    categories: [String]
    collaborators: [ID]
  }
  type User {
    id: ID
    email: String
    fullName: String
    items: [Todo]
  }
  type Query {
    login(email: String!, pwd: String!) : User
    collaborators(todoItemId: ID!) : [User]
    itemsByCategory(category: String!) : [Todo]
  }
  input UserInput {
    email: String
    password: String
    fullName: String
  }
  input TodoInput {
    title: String
    details: String
    status: String
    categories: [String]
    collaborators: [ID]
  }
  type Mutation {
    createUser(input: UserInput) : User
    updateUser(id: ID!, input: UserInput) : User
    createTodo(userId: ID!, input: TodoInput) : Todo
    updateTodo(id: ID!, input: TodoInput) : Todo
  }
`);

const database = 'db\\todolistdb.sqlite3';
const user = new User(database);
const todo = new Todo(database);

export const root = {
  login: (args) => {
    return user.login(args);
  },
  collaborators: (args) => {
    return todo.collaborators(args);
  },
  itemsByCategory: (args) => {
    return todo.itemsByCategory(args);
  },
  createUser: (args) => {
    return user.create(args);
  },
  updateUser: (args) => {
    return user.update(args);
  },
  createTodo: (args) => {
    return todo.create(user, args);
  },
  updateTodo: (args) => {
    return todo.update(args);
  }
}
