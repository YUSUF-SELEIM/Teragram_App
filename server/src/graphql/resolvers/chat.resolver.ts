
import { findSingleChat, createSingleChat, findGroupChat, createGroupChat, getUserChats } from '../services/chat.service';

const chatResolvers = {
    Query: {
        userChats: async (_parent: any, args: any) => {
            const { id } = args;
            console.log('Chats query called with args:', args);
            return getUserChats(id)
        }
    },
  Mutation: {
    createChat: async (_parent: any, args: any) => {
      const { type, userIds } = args
      console.log('Create chat mutation called with args:', args);
      if (type === 'SINGLE') {
        const existingChat = await findSingleChat(userIds);
        if (existingChat) {
          return existingChat;
        }
        return await createSingleChat(userIds);
      } else if (type === 'GROUP') {
        const existingChat = await findGroupChat(userIds);
        if (existingChat) {
          return existingChat;
        }
        return await createGroupChat(userIds);
      }
    },
  }
};

export default chatResolvers;
