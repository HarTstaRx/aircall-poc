import { ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { StoreContextInterface } from '../../shared/interfaces';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Path: ${path?.join('/') ?? ''}`
      )
    );
  if (networkError)
    console.log(`[${networkError.name}]: ${networkError.message}`);
});

export const getErrorLink = (storeContext: StoreContextInterface): ApolloLink =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message }) => {
        storeContext.changeSnackbar({
          isVisible: true,
          message: message,
          title: 'GraphQL error',
          type: 'warning',
        });
      });
    if (networkError)
      storeContext.changeSnackbar({
        isVisible: true,
        message: networkError.message,
        title: networkError.name,
        type: 'error',
      });
  });
