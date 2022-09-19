import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

export const wsLink = new GraphQLWsLink(
  createClient({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    url: process.env.REACT_APP_API_WS as string,
  })
);
