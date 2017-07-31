import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Status,
  UserDao,
  TodoDao
} from './sqlite3-dao';

const sha1 = require('sha1');

const user = new UserDao();
const todo = new TodoDao();

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    console.log('type = ' + type);
    console.log('id = ' + id);
    if (type === 'User') {
      return user.read(id);
    }
    else if (type === 'Todo') {
      return todo.read(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return GraphQLUser;
    }
    else if (obj instanceof Todo) {
      return GraphQLTodo;
    }
    else if (obj instanceof Status) {
      return GraphQLStatus;
    }
    return null;
  }
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: globalIdField('Todo'),
    user_id: { type: GraphQLInt },
    status: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
  interfaces: [nodeInterface]
});

const {
  connectionType: GraphQLTodoConnection,
  edgeType: TodoEdge,
} = connectionDefinitions({name: 'Todo',
                           nodeType: GraphQLTodo});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    todos: {
      type: GraphQLTodoConnection,
      args: connectionArgs,
      resolve: (user, args) => connectionFromPromisedArray(
        todo.list(user.id),
        args
      ),
    }
  }),
  interfaces: [nodeInterface]
});

const dummy = {id: "1", email: "a.g", firstName: "a", lastName: "b"};

const GraphQLStatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  }),
  interfaces: [nodeInterface]
});


const GraphQLUserOrStatusType = new GraphQLUnionType({
  name: 'UserOrStatus',
  types: [ GraphQLUser, GraphQLStatus ],
  resolveType(value) {
    if (value instanceof UserDao) {
      return GraphQLUserType;
    }
    if (value instanceof Status) {
      return GraphQLStatusType;
    }
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: GraphQLUser,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: (root, args) => user.read(args.id)
    },
    session: {
      type: GraphQLUser,
      args: {
        username: {type: new GraphQLNonNull(GraphQLID)},
        password: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (root, args) => user.authenticate(args.username, args.password)
    },
    node: nodeField,
  }),
});

const GraphQLChangeUserMutation = mutationWithClientMutationId({
  name: 'ChangeUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: ({localUserId}) => user.read(localUserId)
    }
  },
  mutateAndGetPayload: ({id, firstName}) => {
    const localUserId = fromGlobalId(id).id;
    user.updateById(localUserId, {first_name: firstName, last_name; lastName,
                                  password: password});
    return {localUserId};
  }
});

const GraphQLCreateUserMutation = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: ({localUserId}) => user.readByUsername(username)
    }
  },
  mutateAndGetPayload: ({id, firstName}) => {
    const localUserId = fromGlobalId(id).id;
    salt = Date.now() + '';
    password = sha1(password + salt);
    user.create({username: username, first_name: firstName, last_name; lastName, email: email,
                  password: password});
    return {localUserId};
  }
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    changeUser: GraphQLChangeUserMutation,
    createUser: GraphQLCreateUserMutation
  }
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
