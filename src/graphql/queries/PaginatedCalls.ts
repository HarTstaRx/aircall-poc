import { gql } from '@apollo/client';

export const PAGINATED_CALLS_QUERY = gql(`
  query PaginatedCalls($offset: Float, $limit: Float) {
    paginatedCalls(offset: $offset, limit: $limit) {
      totalCount
      hasNextPage
      nodes {
        id
        direction
        from
        to
        duration
        call_type
        created_at
        is_archived
      }
    }
  }
`);
