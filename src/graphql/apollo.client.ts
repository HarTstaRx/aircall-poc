import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
  split,
  concat,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { ACCESS_TOKEN_STORAGE } from '../constants';
import getRefreshToken from './refresh.middleware';
import { GraphResponseInterface, ErrorInterface } from './interfaces';

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return forward(operation);
});
const wsLink = new GraphQLWsLink(
  createClient({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    url: process.env.REACT_APP_API_WS as string,
  })
);
const httpLink = new HttpLink({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  uri: process.env.REACT_APP_API_HTTP as string,
  fetch: (
    uri: RequestInfo,
    options?: RequestInit | undefined
  ): Promise<Response> => {
    const initialRequest = fetch(uri, options);

    let initialResponse: Response | null = null;
    return initialRequest
      .then((response) => {
        initialResponse = response.clone();
        return response.json();
      })
      .then((json: GraphResponseInterface<unknown>) => {
        const errors = json.errors;
        const isUnauthorized = (error: ErrorInterface) =>
          error.message.toLocaleLowerCase() === 'unauthorized';
        if (!errors || !errors.some(isUnauthorized))
          return initialResponse as Response;

        const refreshFailed = (error: ErrorInterface) =>
          error.path.includes('refreshTokenV2');

        if (errors.some(refreshFailed)) {
          console.warn('Refresh token failed. Consider log out');
          throw new Error('Refresh token failed');
        }

        return getRefreshToken(client).then((access_token: string) => {
          return fetch(uri, {
            ...options,
            headers: {
              ...options?.headers,
              authorization: `Bearer ${access_token}`,
            },
          });
        });
      });
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, splitLink),
});

export default client;
