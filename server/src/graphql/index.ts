import path from 'path';
import { readFileSync } from 'fs';
import userResolvers from './resolvers/user.resolver';
import chatResolvers from './resolvers/chat.resolver';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const userTypeDefs = readFileSync(path.join(__dirname, './typeDefs/user.graphql'), 'utf-8');
const chatTypeDefs = readFileSync(path.join(__dirname, './typeDefs/chat.graphql'), 'utf-8');

export const typeDefs = ` 
  ${userTypeDefs},
  ${chatTypeDefs}
`;

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...chatResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...chatResolvers.Mutation,
  },
};