import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import {
  FilterAlt,
  Archive,
  Unarchive,
  EventRepeat,
  Today,
  CallMade,
  CallReceived,
  CallMissed,
  Voicemail,
  Call as CallIcon,
} from '@mui/icons-material';

import { CallInterface } from '../../graphql/interfaces';
import { ToggleWithText, CheckboxWithText } from '../';
import {
  getLastMonthCalls,
  getLastWeekCalls,
  getTodayCalls,
  getYesterdayCalls,
} from '../call/call.utils';
import { CallTypeEnum } from '../../graphql/enums/call-type.enum';
import { partialCall } from '../../shared/utils';

import './CallListOptions.scss';

interface Props {
  callList: CallInterface[];
  handleArchived: boolean;
  handleSelectAll: (newValue: boolean) => void;
  handleGroupByDate: (newValue: boolean) => void;
  handleFilterSideEffects: (
    filtered: CallInterface[],
    areActive: boolean
  ) => void;
}

export const CallListOptions = ({
  callList,
  handleArchived,
  handleSelectAll,
  handleGroupByDate,
  handleFilterSideEffects,
}: Props): JSX.Element => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const handleFilterNone = () => {
    handleFilterSideEffects(callList, false);
  };
  const handleFilterByArchive = (archived: boolean) => {
    const filtered = callList.filter((c) => c.is_archived === archived);
    handleFilterSideEffects(filtered, true);
  };
  const handleFilterByType = (callType: CallTypeEnum) => {
    const filtered = callList.filter((c) => c.call_type === callType);
    handleFilterSideEffects(filtered, true);
  };
  const handleFilterByDate = (
    callFilterFn: (calls: CallInterface[]) => CallInterface[]
  ) => {
    const filtered = callFilterFn(callList);
    handleFilterSideEffects(filtered, true);
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
    const filtered = callList.filter((c) => c.direction === direction);
    handleFilterSideEffects(filtered, true);
  };

  useEffect(() => {
    if (handleArchived) setSelectAll(false);
  }, [handleArchived]);

  return (
    <div className='call-list__options'>
      <CheckboxWithText
        text='Select all'
        onChange={handleSelectAll}
        checked={selectAll}
      />
      <ToggleWithText
        text='Group calls by date'
        onChange={handleGroupByDate}
      />
      <Button onClick={(evt) => setFilterAnchor(evt.currentTarget)}>
        <FilterAlt />
      </Button>
      <Menu
        anchorEl={filterAnchor}
        open={filterAnchor !== null}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        className='call-filter'
      >
        <MenuItem onClick={() => handleFilterNone()}>All</MenuItem>
        <MenuItem onClick={() => handleFilterByArchive(true)}>
          <Archive />
          Archived
        </MenuItem>
        <MenuItem onClick={() => handleFilterByArchive(false)}>
          <Unarchive />
          Not archived
        </MenuItem>
        <MenuItem onClick={() => handleFilterByType(CallTypeEnum.MISSED)}>
          <CallMissed />
          Missed
        </MenuItem>
        <MenuItem onClick={() => handleFilterByType(CallTypeEnum.ANSWERED)}>
          <CallIcon />
          Answered
        </MenuItem>
        <MenuItem onClick={() => handleFilterByType(CallTypeEnum.VOICEMAIL)}>
          <Voicemail />
          Voicemail
        </MenuItem>
        <MenuItem onClick={() => handleFilterByDirection('inbound')}>
          <CallReceived />
          Inbound
        </MenuItem>
        <MenuItem onClick={() => handleFilterByDirection('outbound')}>
          <CallMade />
          Outbound
        </MenuItem>
        <MenuItem onClick={handleFilterByDateToday}>
          <Today />
          Today
        </MenuItem>
        <MenuItem onClick={handleFilterByDateYesterday}>
          <EventRepeat />
          Yesterday
        </MenuItem>
        <MenuItem onClick={handleFilterByDateLastWeek}>
          <EventRepeat />
          Last week
        </MenuItem>
        <MenuItem onClick={handleFilterByDateLastMonth}>
          <EventRepeat />
          Last month
        </MenuItem>
      </Menu>
    </div>
  );
};
