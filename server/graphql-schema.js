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
  UserDao,
  TodoDao
} from './sqlite3-dao';

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

const GraphQLChangeFirstNameMutation = mutationWithClientMutationId({
  name: 'ChangeFirstName',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: ({localUserId}) => user.read(localUserId)
    }
  },
  mutateAndGetPayload: ({id, firstName}) => {
    const localUserId = fromGlobalId(id).id;
    user.updateById(localUserId, {first_name: firstName})
    return {localUserId};
  }
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    changeFirstName: GraphQLChangeFirstNameMutation
  }
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
