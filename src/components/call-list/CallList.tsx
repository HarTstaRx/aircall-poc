import React, { useState, useEffect, useContext } from 'react';
import { FetchResult, useLazyQuery, useMutation } from '@apollo/client';
import { Pagination, Stack, Divider, Button } from '@mui/material';

import { PAGINATED_CALLS_QUERY } from '../../graphql/queries';
import { ARCHIVE_CALL_MUTATION } from '../../graphql/mutations';
import {
  ArchiveCallResponseInterface,
  CallInterface,
  PaginatedCallsResponseInterface,
} from '../../graphql/interfaces';
import { StoreContextInterface } from '../../shared/interfaces';
import { StoreContext } from '../../contexts/store.context';
import { Call, ToggleWithText, CheckboxWithText } from '../';
import {
  getLastMonthCalls,
  getLastWeekCalls,
  getTodayCalls,
  getYesterdayCalls,
} from '../call/call.utils';

import './CallList.scss';

export const CallList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [callList, setCallList] = useState<CallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [groupByDate, setGroupByDate] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const pageSize = 10;
  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );
  const [archiveCall, { loading: loadingArchive }] =
    useMutation<ArchiveCallResponseInterface>(ARCHIVE_CALL_MUTATION);

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
    setSelectAll(newValue);
    if (newValue) setSelectedCalls(callList.map((c) => c.id));
    else setSelectedCalls([]);
  };
  const handleArchiveCalls = () => {
    const promises: Promise<FetchResult<ArchiveCallResponseInterface>>[] = [];
    for (const archiveCallId of selectedCalls) {
      promises.push(archiveCall({ variables: { archiveCallId } }));
    }
    void Promise.all(promises).then((responses) => {
      setSelectedCalls([]);
      setSelectAll(false);
      const results = responses.map((response) => response.data?.archiveCall);
      setCallList(
        callList.map((call: CallInterface) => {
          const result = results.find((r) => r?.id === call.id);
          if (!result) return call;
          return {
            ...call,
            is_archived: result.is_archived,
          };
        })
      );
    });
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
          checked={selectAll}
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
      <div className='call-list__actions'>
        <Button
          variant='contained'
          onClick={handleArchiveCalls}
          disabled={selectedCalls.length === 0 || loadingArchive}
        >
          Toggle archive selected calls
        </Button>
      </div>
    </div>
  );
};
