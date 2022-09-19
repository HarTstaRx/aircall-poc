import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Pagination } from '@mui/material';

import { PAGINATED_CALLS_QUERY } from '../../graphql/queries';
import {
  CallInterface,
  PaginatedCallsResponseInterface,
} from '../../graphql/interfaces';
import { StoreContextInterface } from '../../shared/interfaces';
import { StoreContext } from '../../contexts/store.context';

export const CallList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [callList, setCallList] = useState<
    PaginatedCallsResponseInterface | undefined
  >();
  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );
  const pageSize = 10;

  const getCalls = (offset = 0) => {
    if (!storeContext.cache.login) return;

    void paginatedCalls({ variables: { offset, limit: pageSize } }).then(
      (result) => {
        setCallList(result.data);
      }
    );
  };

  const handlePaginationChange = (_evt: unknown, page: number) => {
    getCalls((page - 1) * pageSize);
  };

  useEffect(() => {
    getCalls();
  }, [storeContext.cache]);

  const total = Math.ceil(
    (callList?.paginatedCalls.totalCount ?? 0) / pageSize
  );

  return (
    <section className='call-list'>
      <Pagination
        count={total}
        variant='outlined'
        shape='rounded'
        onChange={handlePaginationChange}
      />
      {callList &&
        callList.paginatedCalls.nodes.map((call: CallInterface) => (
          <div key={call.id}>{call.id}</div>
        ))}
    </section>
  );
};
