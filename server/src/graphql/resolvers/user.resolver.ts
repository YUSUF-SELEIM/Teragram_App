import { register, getAllUsers, login } from "../services/user.service";

interface contextValue {
  user: any;
}

// the params of the resolvers are: _parent, args, contextValue
// _parent: the result of the previous resolver
// args: the arguments passed to the resolver
// contextValue: the context object passed to the resolver
// In this case, the context object is the user object and it must be the third args of the resolver
// so that the resolver knows that this is the context object
const userResolvers = {
  Query: {
    users: async (_parent: any, args: any, contextValue: contextValue) => {
      return getAllUsers(_parent, args, contextValue);
    }
  },
  Mutation: {
    register: async (_parent: any, args: any) => {
      return register(_parent, args);
    },
    login: async (_parent: any, args: any) => {
      return login(_parent, args);
    },
  },
};

export default userResolvers;