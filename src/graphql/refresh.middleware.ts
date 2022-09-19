import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import {
  GraphResponseInterface,
  ErrorInterface,
  RefreshTokenResponseInterface,
} from './interfaces';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from '../constants';
import { REFRESH_TOKEN_MUTATION } from './mutations';

type CustomFetchType = (
  uri: RequestInfo,
  options?: RequestInit | undefined
) => Promise<Response>;
const refreshTokenMiddlewareWrapper = (
  client: ApolloClient<NormalizedCacheObject>
): CustomFetchType => {
  return (
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
  };
};

const getRefreshToken = (
  client: ApolloClient<NormalizedCacheObject>
): Promise<string> => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE);
  console.log('Retrieving refresh_token...');
  const refresh = client.mutate<RefreshTokenResponseInterface>({
    mutation: REFRESH_TOKEN_MUTATION,
    context: {
      headers: {
        Authorization: refreshToken ? `Bearer ${refreshToken}` : undefined,
      },
    },
  });

  return refresh.then((refreshResponse) => {
    const result = refreshResponse.data?.refreshTokenV2;
    if (!result) return '';
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE, result?.refresh_token);
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE, result?.access_token);
    return result?.access_token ?? '';
  });
};

export { refreshTokenMiddlewareWrapper };
export default getRefreshToken;
