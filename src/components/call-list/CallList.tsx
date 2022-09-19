import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Pagination, Stack } from '@mui/material';

import { PAGINATED_CALLS_QUERY } from '../../graphql/queries';
import {
  CallInterface,
  PaginatedCallsResponseInterface,
} from '../../graphql/interfaces';
import { StoreContextInterface } from '../../shared/interfaces';
import { StoreContext } from '../../contexts/store.context';
import { Call } from '../';

import './CallList.scss';

export const CallList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [callList, setCallList] = useState<CallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const pageSize = 10;
  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );

  const handlePaginationChange = (_evt: unknown, newPage: number) => {
    setPage(newPage);
  };

  const sortByDate = (callA: CallInterface, callB: CallInterface): number => {
    const dateA = Date.parse(callA.created_at);
    const dateB = Date.parse(callB.created_at);

    return dateB - dateA;
  };

  useEffect(() => {
    if (!storeContext.cache.login) return;

    // DAVID: We could avoid hardcoding the limit value if the server offered some kind of filtering by date
    void paginatedCalls({ variables: { offset: 0, limit: 500 } }).then(
      (result) => {
        if (result.data && result.data.paginatedCalls) {
          setCallList(result.data.paginatedCalls.nodes);
          setTotal(
            Math.floor((result.data.paginatedCalls.totalCount ?? 0) / pageSize)
          );
        }
      }
    );
  }, [storeContext.cache]);

  return (
    <div className='call-list'>
      <Pagination
        count={total}
        variant='outlined'
        shape='rounded'
        onChange={handlePaginationChange}
        className='call-list__pagination'
      />
      <Stack className='call-list__stack'>
        {[...callList]
          .sort(sortByDate)
          .slice(page * pageSize, page * pageSize + pageSize)
          .map((call: CallInterface) => (
            <Call
              key={call.id}
              {...call}
            />
          ))}
      </Stack>
    </div>
  );
};
