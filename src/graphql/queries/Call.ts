import { gql } from '@apollo/client';

export const CALL_QUERY = gql(`
  query Call($callId: ID!) {
    call(id: $callId) {
      id
      direction
      from
      to
      duration
      via
      is_archived
      call_type
      created_at
      notes {
        id
        content
      }
    }
  }
`);
