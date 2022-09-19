import { gql } from '@apollo/client';

export const PAGINATED_CALLS_QUERY = gql(`
  query PaginatedCalls {
    paginatedCalls {
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
      totalCount
      hasNextPage
    }
  }
`);
