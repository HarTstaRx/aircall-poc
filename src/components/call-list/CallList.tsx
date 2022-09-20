import React, { useState, useEffect, useContext, useRef } from 'react';
import { FetchResult, useLazyQuery, useMutation } from '@apollo/client';
import {
  Pagination,
  Stack,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

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
  sortByDate,
} from '../call/call.utils';
import { CallTypeEnum } from '../../graphql/enums/call-type.enum';
import { partialCall } from '../../shared/utils';

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
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

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

  const filterSideEffects = (filtered: CallInterface[], areActive = true) => {
    setAreFiltersActive(areActive);
    setGroupByDate(false);
    setCallListFiltered(filtered);
    setTotal(Math.ceil(filtered.length / pageSize));
  };
  const handleFilterNone = () => {
    filterSideEffects(callList.current, false);
  };
  const handleFilterByArchive = (archived: boolean) => {
    const filtered = callList.current.filter((c) => c.is_archived === archived);
    filterSideEffects(filtered);
  };
  const handleFilterByType = (callType: CallTypeEnum) => {
    const filtered = callList.current.filter((c) => c.call_type === callType);
    filterSideEffects(filtered);
  };
  const handleFilterByDate = (
    callFilterFn: (calls: CallInterface[]) => CallInterface[]
  ) => {
    const filtered = callFilterFn(callList.current);
    filterSideEffects(filtered);
  };
  const handleFilterByDateToday = partialCall(
    handleFilterByDate,
    getTodayCalls
  );
  const handleFilterByDateYesterday = partialCall(
    handleFilterByDate,
    getYesterdayCalls
  );
  const handleFilterByDateLastWeek = partialCall(
    handleFilterByDate,
    getLastWeekCalls
  );
  const handleFilterByDateLastMonth = partialCall(
    handleFilterByDate,
    getLastMonthCalls
  );
  const handleFilterByDirection = (direction: 'inbound' | 'outbound') => {
    const filtered = callList.current.filter((c) => c.direction === direction);
    filterSideEffects(filtered);
  };

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
  const todayCalls = getTodayCalls(callList.current).sort(sortByDate);
  const yesterdayCalls = getYesterdayCalls(callList.current).sort(sortByDate);
  const lastWeekCalls = getLastWeekCalls(callList.current).sort(sortByDate);
  const lastMonthCalls = getLastMonthCalls(callList.current).sort(sortByDate);

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
        <Button onClick={(evt) => setFilterAnchor(evt.currentTarget)}>
          Filter
        </Button>
        <Menu
          anchorEl={filterAnchor}
          open={filterAnchor !== null}
          onClose={() => setFilterAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuItem onClick={() => handleFilterNone()}>All</MenuItem>
          <MenuItem onClick={() => handleFilterByArchive(true)}>
            Archived
          </MenuItem>
          <MenuItem onClick={() => handleFilterByArchive(false)}>
            Not archived
          </MenuItem>
          <MenuItem onClick={() => handleFilterByType(CallTypeEnum.MISSED)}>
            Missed
          </MenuItem>
          <MenuItem onClick={() => handleFilterByType(CallTypeEnum.ANSWERED)}>
            Answered
          </MenuItem>
          <MenuItem onClick={() => handleFilterByType(CallTypeEnum.VOICEMAIL)}>
            Voicemail
          </MenuItem>
          <MenuItem onClick={() => handleFilterByDirection('inbound')}>
            Inbound
          </MenuItem>
          <MenuItem onClick={() => handleFilterByDirection('outbound')}>
            Outbound
          </MenuItem>
          <MenuItem onClick={handleFilterByDateToday}>Today</MenuItem>
          <MenuItem onClick={handleFilterByDateYesterday}>Yesterday</MenuItem>
          <MenuItem onClick={handleFilterByDateLastWeek}>Last week</MenuItem>
          <MenuItem onClick={handleFilterByDateLastMonth}>Last month</MenuItem>
        </Menu>
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
            {printCalls(
              [...callListFiltered]
                .sort(sortByDate)
                .slice(page * pageSize, page * pageSize + pageSize)
            )}
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
