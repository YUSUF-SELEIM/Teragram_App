
import { findSingleChat, createSingleChat, findGroupChat, createGroupChat, getUserChats, getMessagesByChatId, addMessage, getChatById } from '../services/chat.service';

const chatResolvers = {
    Query: {
        userChats: async (_parent: any, args: any) => {
            const { id } = args;
            console.log('Chats query called with args:', args);
            return getUserChats(id)
        },
        getMessagesByChatId: async (_parent: any, args: any) => {
          const { chatId } = args;
          console.log('Getting the messages:', args);
          return getMessagesByChatId(chatId);
        },
        getChatById: async (_parent: any, args: any) => {
          const { id } = args;
          console.log('Getting the chat:', args); 
          return getChatById(id);
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
    addMessage: async (_parent: any, args: any, context: any) => {
      const { chatId, content, imageUrl } = args;
      const { user } = context;
      console.log('Add message mutation called with args:', args);  
      console.log('User:', user);
      // if (!user) {
      //   throw new Error("Not authenticated");
      // }

      // Call the service function to add the message
      const newMessage = await addMessage({
        chatId,
        content,
        imageUrl,
        userId: user.id,
      });

      return newMessage;
  }
}
};

export default chatResolvers;
