import path from 'path';
import { readFileSync } from 'fs';
import userResolvers from './resolvers/user.resolver';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const userTypeDefs = readFileSync(path.join(__dirname, './typeDefs/user.graphql'), 'utf-8');

export const typeDefs = ` 
  ${userTypeDefs}
`;

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};