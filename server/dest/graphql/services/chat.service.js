import { prisma } from '../../prisma/prismaClient';
export async function findSingleChat(userIds) {
    console.log("Finding a chat between " + userIds[0] + " and " + userIds[1]);
    // Ensure only two userIds are provided
    if (userIds.length !== 2) {
        throw new Error('Single chat requires exactly two user IDs.');
    }
    const existingChat = await prisma.chat.findFirst({
        where: {
            type: 'SINGLE',
            userChats: {
                some: {
                    userId: userIds[0]
                }
            },
            AND: {
                userChats: {
                    some: {
                        userId: userIds[1]
                    }
                }
            }
        },
        include: {
            userChats: {
                include: {
                    user: true // Include users in the result
                }
            }
        }
    });
    if (existingChat) {
        console.log("Chat found: ", existingChat);
    }
    return existingChat;
}
export async function createSingleChat(userIds) {
    console.log(userIds);
    // Ensure only two userIds are provided
    if (userIds.length !== 2) {
        throw new Error('Single chat requires exactly two user IDs.');
    }
    // Check if a chat between these users already exists
    const existingChat = await findSingleChat(userIds);
    if (existingChat) {
        throw new Error('A chat between these users already exists.');
    }
    const chat = await prisma.chat.create({
        data: {
            type: 'SINGLE',
            userChats: {
                create: userIds.map(userId => ({
                    userId
                }))
            }
        },
        include: {
            userChats: {
                include: {
                    user: true // Include users in the result
                }
            }
        }
    });
    return chat;
}
// Function to find an existing group chat
export async function findGroupChat(userIds) {
    // Sort userIds to ensure consistency
    userIds.sort();
    const existingChat = await prisma.chat.findFirst({
        where: {
            type: 'GROUP',
            userChats: {
                every: {
                    userId: {
                        in: userIds
                    }
                }
            }
        },
        include: {
            userChats: {
                include: {
                    user: true // Include users in the result
                }
            }
        }
    });
    return existingChat;
}
// Function to create a new group chat
export async function createGroupChat(userIds) {
    // Sort userIds to ensure consistency
    userIds.sort();
    const chat = await prisma.chat.create({
        data: {
            type: 'GROUP',
            userChats: {
                create: userIds.map(userId => ({
                    userId
                }))
            }
        },
        include: {
            userChats: {
                include: {
                    user: true // Include users in the result
                }
            }
        }
    });
    return chat;
}
// Function to add a user to an existing group chat
export async function addUserToGroupChat(chatId, userId) {
    const userChat = await prisma.userChat.create({
        data: {
            chatId,
            userId
        }
    });
    return userChat;
}
export async function getUserChats(userId) {
    if (!userId) {
        throw new Error("User ID must be provided");
    }
    const userChats = await prisma.chat.findMany({
        where: {
            userChats: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            userChats: {
                include: {
                    user: true
                }
            },
            messages: true
        }
    });
    return userChats.map(chat => ({
        ...chat,
        users: chat.userChats
            .filter(userChat => userChat.userId !== userId) // Filter out the current user
            .map(userChat => userChat.user),
        messages: chat.messages
    }));
}
export async function getChatById(id) {
    if (!id) {
        throw new Error("Chat ID must be provided");
    }
    const chat = await prisma.chat.findUnique({
        where: { id: id },
        include: {
            userChats: {
                include: {
                    user: true // Ensure users are fetched
                }
            }
        }
    });
    if (!chat) {
        throw new Error("Chat not found");
    }
    // Transforming the userChats relation to match the users field in your GraphQL schema
    const users = chat.userChats.map(userChat => userChat.user);
    return {
        ...chat,
        users // Adding the transformed users field
    };
}
export async function getMessagesByChatId(chatId) {
    console.log("ID: " + chatId);
    if (!chatId) {
        throw new Error("Chat ID must be provided");
    }
    // Fetch messages for the specific chat
    const messages = await prisma.message.findMany({
        where: { chatId: chatId },
        include: {
            sender: true, // Include sender details in messages
        },
    });
    // Ensure an empty array is returned if no messages are found
    return messages || [];
}
export const addMessage = async ({ chatId, content, imageUrl, userId }) => {
    // Create a new message in the chat
    const newMessage = await prisma.message.create({
        data: {
            content,
            imageUrl: imageUrl || null,
            chat: {
                connect: { id: chatId },
            },
            sender: {
                connect: { id: userId },
            },
        },
        include: {
            sender: true,
            chat: {
                include: {
                    userChats: {
                        include: {
                            user: true, // Include users in the chat
                        },
                    },
                },
            },
        },
    });
    // Transform userChats to users
    const chatWithUsers = {
        ...newMessage,
        chat: {
            ...newMessage.chat,
            users: newMessage.chat.userChats.map(uc => uc.user),
        },
    };
    return chatWithUsers;
};
