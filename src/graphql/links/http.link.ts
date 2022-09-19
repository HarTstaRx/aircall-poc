import { HttpLink } from '@apollo/client';

export const getHtpLink = (
  customFetch: (
    uri: RequestInfo,
    options?: RequestInit | undefined
  ) => Promise<Response>
): HttpLink => {
  return new HttpLink({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    uri: process.env.REACT_APP_API_HTTP as string,
    fetch: customFetch,
  });
};
