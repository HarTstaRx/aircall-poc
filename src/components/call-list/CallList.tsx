import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { FetchResult, useLazyQuery, useMutation } from '@apollo/client';
import { Pagination, Stack, Button } from '@mui/material';

import { PAGINATED_CALLS_QUERY } from '../../graphql/queries';
import { ARCHIVE_CALL_MUTATION } from '../../graphql/mutations';
import {
  ArchiveCallResponseInterface,
  CallInterface,
  PaginatedCallsResponseInterface,
} from '../../graphql/interfaces';
import { StoreContextInterface } from '../../shared/interfaces';
import { StoreContext } from '../../contexts/store.context';
import { Call, CallListGrouped, CallListOptions } from '../';
import { sortByDate } from '../call/call.utils';

import './CallList.scss';

export const CallList = (): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const callList = useRef<CallInterface[]>([]);
  const [callListFiltered, setCallListFiltered] = useState<CallInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [groupByDate, setGroupByDate] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [areFiltersActive, setAreFiltersActive] = useState<boolean>(false);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);

  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );
  const [archiveCall, { loading: loadingArchive }] =
    useMutation<ArchiveCallResponseInterface>(ARCHIVE_CALL_MUTATION);

  const handlePaginationChange = (_evt: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  const handleSelectedCallChange = (callId: string, newValue: boolean) => {
    if (selectedCalls.includes(callId) && !newValue)
      setSelectedCalls(selectedCalls.filter((id) => id !== callId));
    else if (!selectedCalls.includes(callId) && newValue)
      setSelectedCalls([...selectedCalls, callId]);
  };
  const handleSelectAllCallsChange = (newValue: boolean) => {
    setSelectAll(newValue);
    if (newValue) setSelectedCalls(callListFiltered.map((c) => c.id));
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
      let filtered = callListFiltered.map((call: CallInterface) => {
        const result = results.find((r) => r?.id === call.id);
        if (!result) return call;
        return {
          ...call,
          is_archived: result.is_archived,
        };
      });
      if (areFiltersActive) filtered = filtered.filter((c) => !c.is_archived);
      setCallListFiltered(filtered);
    });
  };

  const filterSideEffects = useCallback(
    (filtered: CallInterface[], areActive = true) => {
      setAreFiltersActive(areActive);
      setGroupByDate(false);
      setCallListFiltered(filtered);
      setTotal(Math.ceil(filtered.length / pageSize));
      setPage(0);
    },
    [callListFiltered, total]
  );

  const printCalls = (calls: CallInterface[]): JSX.Element[] => {
    return calls.map((call: CallInterface) => (
      <Call
        key={call.id}
        {...call}
        isSelected={selectedCalls.includes(call.id)}
        onSelectedChange={handleSelectedCallChange}
      />
    ));
  };

  const pageSize = 10;

  useEffect(() => setPage(0), [groupByDate]);

  useEffect(() => {
    if (callListFiltered.length === 0) setCallListFiltered(callList.current);
    else
      setCallListFiltered(
        callListFiltered.map((callFiltered: CallInterface) => {
          const call = callList.current.find((c) => (c.id = callFiltered.id));
          return call ?? callFiltered;
        })
      );
  }, [callList.current]);

  useEffect(() => {
    if (!storeContext.cache.login) return;

    // DAVID: We could avoid hardcoding the limit value if the server offered some kind of filtering by date
    void paginatedCalls({ variables: { offset: 0, limit: 500 } }).then(
      (result) => {
        if (result.data && result.data.paginatedCalls) {
          callList.current = result.data.paginatedCalls.nodes;
          setTotal(
            Math.ceil((result.data.paginatedCalls.totalCount ?? 0) / pageSize)
          );
        }
      }
    );
  }, [storeContext.cache]);

  return (
    <div className='call-list'>
      <CallListOptions
        callList={callList.current}
        handleArchived={selectAll}
        handleSelectAll={handleSelectAllCallsChange}
        handleGroupByDate={setGroupByDate}
        handleFilterSideEffects={filterSideEffects}
      />
      {!groupByDate && (
        <>
          <Pagination
            count={total}
            variant='outlined'
            shape='rounded'
            onChange={handlePaginationChange}
            className='call-list__pagination'
            page={page + 1}
          />
          <Stack className='call-list__stack'>
            {printCalls(
              [...callListFiltered]
                .sort(sortByDate)
                .slice(page * pageSize, page * pageSize + pageSize)
            )}
          </Stack>
        </>
      )}
      {groupByDate && (
        <CallListGrouped
          callList={callList.current}
          handleSelectedCallChange={handleSelectedCallChange}
          isCallSelected={(callId: string) => selectedCalls.includes(callId)}
        />
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
