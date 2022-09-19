import { gql } from '@apollo/client';

export const ARCHIVE_CALL_MUTATION = gql(`
  mutation ArchiveCall($archiveCallId: ID!) {
    archiveCall(id: $archiveCallId) {
      id
      is_archived
    }
  }
`);
