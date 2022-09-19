import { ApolloLink } from '@apollo/client';

import { ACCESS_TOKEN_STORAGE } from '../../constants';

export const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return forward(operation);
});
