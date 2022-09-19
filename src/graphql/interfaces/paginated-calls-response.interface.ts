import { CallInterface } from './call.interface';

export interface PaginatedCallsResponseInterface {
  totalCount: number;
  hasNextPage: boolean;
  nodes: CallInterface[];
}
