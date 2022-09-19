import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Pagination, Stack, Divider } from '@mui/material';

import { PAGINATED_CALLS_QUERY } from '../../graphql/queries';
import {
  CallInterface,
  PaginatedCallsResponseInterface,
} from '../../graphql/interfaces';
import { StoreContextInterface } from '../../shared/interfaces';
import { StoreContext } from '../../contexts/store.context';
import { Call, ToggleWithText, CheckboxWithText } from '../';

import './CallList.scss';
import {
  getLastMonthCalls,
  getLastWeekCalls,
  getTodayCalls,
  getYesterdayCalls,
} from '../call/call.utils';

export const CallList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [callList, setCallList] = useState<CallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [groupByDate, setGroupByDate] = useState<boolean>(false);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const pageSize = 10;
  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );

  const handlePaginationChange = (_evt: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelectedCallChange = (callId: string, newValue: boolean) => {
    if (selectedCalls.includes(callId) && !newValue)
      setSelectedCalls(selectedCalls.filter((id) => id !== callId));
    else if (!selectedCalls.includes(callId) && newValue)
      setSelectedCalls([...selectedCalls, callId]);
  };
  const handleSelectAllCallsChange = (newValue: boolean) => {
    if (newValue) setSelectedCalls(callList.map((c) => c.id));
    else setSelectedCalls([]);
  };

  const sortByDate = (callA: CallInterface, callB: CallInterface): number => {
    const dateA = Date.parse(callA.created_at);
    const dateB = Date.parse(callB.created_at);

    return dateB - dateA;
  };

  const printCalls = (calls: CallInterface[]): JSX.Element[] => {
    return calls
      .slice(page * pageSize, page * pageSize + pageSize)
      .map((call: CallInterface) => (
        <Call
          key={call.id}
          {...call}
          isSelected={selectedCalls.includes(call.id)}
          onSelectedChange={handleSelectedCallChange}
        />
      ));
  };

  const todayCalls = getTodayCalls(callList);
  const yesterdayCalls = getYesterdayCalls(callList);
  const lastWeekCalls = getLastWeekCalls(callList);
  const lastMonthCalls = getLastMonthCalls(callList);

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
      <div className='call-list__options'>
        <CheckboxWithText
          text='Select all'
          onChange={handleSelectAllCallsChange}
        />
        <ToggleWithText
          text='Group calls by date'
          onChange={setGroupByDate}
        />
      </div>
      {!groupByDate && (
        <>
          <Pagination
            count={total}
            variant='outlined'
            shape='rounded'
            onChange={handlePaginationChange}
            className='call-list__pagination'
          />
          <Stack className='call-list__stack'>
            {printCalls([...callList].sort(sortByDate))}
          </Stack>
        </>
      )}
      {groupByDate && (
        <Stack className='call-list__stack grouped'>
          {todayCalls.length > 0 && (
            <>
              <div className='call-list__stack__title'>Today</div>
              {printCalls(todayCalls)}
              <Divider />
            </>
          )}
          {yesterdayCalls.length > 0 && (
            <>
              <div className='call-list__stack__title'>Yesterday</div>
              {printCalls(yesterdayCalls)}
              <Divider />
            </>
          )}
          {lastWeekCalls.length > 0 && (
            <>
              <div className='call-list__stack__title'>Last week</div>
              {printCalls(lastWeekCalls)}
              <Divider />
            </>
          )}
          {lastMonthCalls.length > 0 && (
            <>
              <div className='call-list__stack__title'>Last month</div>
              {printCalls(lastMonthCalls)}
              <Divider />
            </>
          )}
        </Stack>
      )}
    </div>
  );
};
