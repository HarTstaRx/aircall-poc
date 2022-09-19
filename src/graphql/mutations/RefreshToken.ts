import { gql } from '@apollo/client';

export const REFRESH_TOKEN_MUTATION = gql(`
  mutation RefreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
      user {
        id
        username
      }
    }
  }
`);
