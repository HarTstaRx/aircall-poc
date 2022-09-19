import React from 'react';
import {
  Error,
  Voicemail,
  CallMade,
  CallReceived,
  CallMissed,
  CallMissedOutgoing,
  Info,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { CallTypeEnum } from '../../graphql/enums/call-type.enum';
import { CallInterface } from '../../graphql/interfaces';

import './Call.scss';
import {
  isToday,
  isYesterday,
  getDayName,
  isLastWeek,
  getShortDateString,
  getShortTimeString,
} from './date.utils';

export const Call = (call: CallInterface): JSX.Element => {
  const getCallNumber = (): string => {
    if (call.direction === 'inbound') return call.from;
    return call.to;
  };

  const getCallTime = (): string => {
    const created = new Date(call.created_at);
    if (isToday(created)) return getShortTimeString(created);
    if (isYesterday(created)) return 'Yesterday';
    if (isLastWeek(created)) return getDayName(created);
    return getShortDateString(created);
  };

  const getIconFromCallTypeAndDirection = (
    callType: CallTypeEnum,
    direction: 'inbound' | 'outbound'
  ): JSX.Element => {
    switch (callType) {
      case CallTypeEnum.MISSED:
        if (direction === 'inbound') return <CallMissed />;
        return <CallMissedOutgoing />;
      case CallTypeEnum.ANSWERED:
        if (direction === 'inbound') return <CallReceived />;
        return <CallMade />;
      case CallTypeEnum.VOICEMAIL:
        return <Voicemail />;
      default:
        return <Error />;
    }
  };

  const handleShowMore = () => {
    console.log('show more for', call.id);
  };

  const getColorClassname = (): string => {
    switch (call.call_type) {
      case CallTypeEnum.MISSED:
        return 'missed';
      case CallTypeEnum.ANSWERED:
        return 'answered';
      case CallTypeEnum.VOICEMAIL:
        return 'voicemail';
      default:
        return '';
    }
  };

  return (
    <div
      id={call.id}
      className='call'
    >
      <div className='call-left-group'>
        <span className={`call__icon ${getColorClassname()}`}>
          {getIconFromCallTypeAndDirection(call.call_type, call.direction)}
        </span>
        <span className='call__number'>{getCallNumber()}</span>
      </div>
      <div className='call-right-group'>
        <span className='call__time'>{getCallTime()}</span>
        <span className='call__detail'>
          <IconButton onClick={handleShowMore}>
            <Info />
          </IconButton>
        </span>
      </div>
    </div>
  );
};
