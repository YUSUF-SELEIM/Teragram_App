"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_Back_End_URL}/graphql`,
    fetchOptions: { cache: "no-store" },
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");

    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink), // Concatenate authLink with httpLink
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
