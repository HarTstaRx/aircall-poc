import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(
  createClient({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    url: process.env.REACT_APP_API_WS as string,
  })
);
const httpLink = new HttpLink({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  uri: process.env.REACT_APP_API_HTTP as string,
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
  link: splitLink,
});

export default client;
