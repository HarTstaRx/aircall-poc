import React from 'react';
import { Stack, Divider } from '@mui/material';

import { CallInterface } from '../../graphql/interfaces';
import { Call } from '../';
import {
  getLastMonthCalls,
  getLastWeekCalls,
  getTodayCalls,
  getYesterdayCalls,
  sortByDate,
} from '../call/call.utils';

interface Props {
  callList: CallInterface[];
  handleSelectedCallChange: (callId: string, newValue: boolean) => void;
  isCallSelected: (callId: string) => boolean;
}
export const CallListGrouped = ({
  callList,
  handleSelectedCallChange,
  isCallSelected,
}: Props): JSX.Element => {
  const printCalls = (calls: CallInterface[]): JSX.Element[] => {
    return calls.map((call: CallInterface) => (
      <Call
        key={call.id}
        {...call}
        isSelected={isCallSelected(call.id)}
        onSelectedChange={handleSelectedCallChange}
      />
    ));
  };

  const todayCalls = getTodayCalls(callList).sort(sortByDate);
  const yesterdayCalls = getYesterdayCalls(callList).sort(sortByDate);
  const lastWeekCalls = getLastWeekCalls(callList).sort(sortByDate);
  const lastMonthCalls = getLastMonthCalls(callList).sort(sortByDate);

  return (
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
  );
};
