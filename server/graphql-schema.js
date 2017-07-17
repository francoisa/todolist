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
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  UserDao
} from './sqlite3-dao';

const user = new UserDao();

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    console.log('type = ' + type);
    console.log('id = ' + id);
    if (type === 'User') {
      return user.read(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    rowid: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
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