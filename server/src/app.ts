import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './graphql/index';
import { context } from "./graphql/context";
import cookieSetter from "./util/cookie-setter";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors({
  origin: ["http://localhost:3000", "https://sandbox.embed.apollographql.com","http://192.168.1.5:3000","https://teragram-app.vercel.app/","https://teragram-app.vercel.app"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/graphql", expressMiddleware(server, {
  context
}));

app.post('/api/set-cookie', cookieSetter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`GraphQL server running on http://localhost:${port}/graphql`);
});
