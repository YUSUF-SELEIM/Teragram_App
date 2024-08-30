import { register, getAllUsers, login, updateUserInfo, getUserInfo } from "../services/user.service";
// the params of the resolvers are: _parent, args, contextValue
// _parent: the result of the previous resolver
// args: the arguments passed to the resolver
// contextValue: the context object passed to the resolver
// In this case, the context object is the user object and it must be the third args of the resolver
// so that the resolver knows that this is the context object
const userResolvers = {
    Query: {
        getAllUsers: async (_parent, args, contextValue) => {
            return getAllUsers(_parent, args, contextValue);
        },
        getUserInfo: async (_parent, args, contextValue) => {
            return getUserInfo(_parent, args, contextValue);
        }
    },
    Mutation: {
        register: async (_parent, args) => {
            return register(_parent, args);
        },
        login: async (_parent, args) => {
            return login(_parent, args);
        },
        updateUserInfo: async (_parent, args, contextValue) => {
            return updateUserInfo(_parent, args, contextValue);
        }
    },
};
export default userResolvers;
