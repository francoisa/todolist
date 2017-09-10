import {buildSchema} from 'graphql';

import {
  Todo,
  User
} from './sqlite3-dao';

let todo = new Todo();
let user = new User();

export const schema = buildSchema(`
  type Todo {
      title: String
      details: String
      status: String
      categories: [String]
      collaborators: [ID]
  }

  type User {
      email: String
      password: String
      items: [Todo]
  }

  type Query {
    login(email: String!, pwd: String!) : User
    collaborators(todoItemId: ID!) : [User]
    itemsByCategory(category: String!) : [Todo]
  }
  `);

function getUser(email, pwd) {
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
  return user;
}

function getCollaborators(id) {
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

function getItemsByCategory(category) {
  var todo = {
    title: 'say hello',
    details: 'talk to someone',
    status: 'open',
    categories: ['test'],
    collaborators: ['wasidah@gmail.com']
  }
  return [todo];
}

export const root = {
  login: ({email, pwd}) => {
    return getUser(email, pwd);
  },
  collaborators: ({todoItemId}) => {
    return getCollaborators(todoItemId);
  },
  itemsByCategory: ({category}) => {
    return getItemsByCategory(category);
  }
}
