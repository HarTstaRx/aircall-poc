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
  }
`);
