import { CallInterface } from '../call.interface';

export interface PaginatedCallsResponseInterface {
  paginatedCalls: {
    totalCount: number;
    hasNextPage: boolean;
    nodes: CallInterface[];
  };
}
