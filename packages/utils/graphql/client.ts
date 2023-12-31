import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { NextSSRInMemoryCache, NextSSRApolloClient } from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { setContext } from "@apollo/client/link/context";

export function getClient(apiUrl: string, authToken?: string) {
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${authToken ? authToken : ""}`,
            },
        };
    });

    const httpLink = new HttpLink({
        uri: apiUrl,
    });

    const { getClient } = registerApolloClient(() => {
        return new NextSSRApolloClient({
            cache: new NextSSRInMemoryCache(),
            link: authLink.concat(httpLink),
        });
    });

    return getClient;
}

export function getClientNoCache(apiUrl: string, authToken?: string) {
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${authToken ? authToken : ""}`,
            },
        };
    });

    const httpLink = new HttpLink({
        uri: apiUrl,
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
}
