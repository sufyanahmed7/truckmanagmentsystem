'use client';
import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

let tokenCache: { token: string | null; expiresAt: number } = { token: null, expiresAt: 0 };

// Fetch Auth0 access token from your API route
async function fetchToken(): Promise<string | null> {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt - 5000) return tokenCache.token;

  const res = await fetch('/api/auth/token', { credentials: 'include' });
  if (!res.ok) return null;

  const data: { accessToken?: string; expiresIn?: number } = await res.json();
  if (!data.accessToken) return null;

  tokenCache = {
    token: data.accessToken,
    expiresAt: now + ((data.expiresIn ?? 300) * 1000), // fallback 5min
  };

  return tokenCache.token;
}

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql',
  fetch: async (uri, options: any) => {
    const token = await fetchToken();
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return fetch(uri, options);
  },
});

// WS link
const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: 'ws://localhost:8000/graphql',
        connectionParams: async () => {
          const token = await fetchToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        lazy: true,
        reconnect: true,
      })
    )
  : null;

// Split based on operation type
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
      },
      wsLink,
      httpLink
    )
  : httpLink;

// Apollo client
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export const ApolloWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
