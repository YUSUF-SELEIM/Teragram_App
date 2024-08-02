import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './graphql/index';
import { context } from "./graphql/context";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors({
  origin: ["http://localhost:3000", "https://sandbox.embed.apollographql.com"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/graphql", expressMiddleware(server, {
  context
}));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`GraphQL server running on http://localhost:${port}/graphql`);
});
