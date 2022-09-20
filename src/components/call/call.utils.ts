import {
  Error,
  Voicemail,
  CallMade,
  CallReceived,
  CallMissed,
  CallMissedOutgoing,
} from '@mui/icons-material';

import { CallTypeEnum } from '../../graphql/enums/call-type.enum';
import { CallInterface } from '../../graphql/interfaces';
import {
  isToday,
  getShortTimeString,
  isYesterday,
  isLastWeek,
  getDayName,
  getShortDateString,
} from './date.utils';

export const getCallNumber = (call: CallInterface): string => {
  if (call.direction === 'inbound') return call.from;
  return call.to;
};

export const getCallTime = (call: CallInterface): string => {
  const created = new Date(call.created_at);
  if (isToday(created)) return getShortTimeString(created);
  if (isYesterday(created)) return 'Yesterday';
  if (isLastWeek(created)) return getDayName(created);
  return getShortDateString(created);
};

export const getIconFromCall = (call: CallInterface) => {
  switch (call.call_type) {
    case CallTypeEnum.MISSED:
      if (call.direction === 'inbound') return CallMissed;
      return CallMissedOutgoing;
    case CallTypeEnum.ANSWERED:
      if (call.direction === 'inbound') return CallReceived;
      return CallMade;
    case CallTypeEnum.VOICEMAIL:
      return Voicemail;
    default:
      return Error;
  }
};
export const getColorClassname = (call: CallInterface): string => {
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

export const getSummary = (call: CallInterface): string => {
  switch (call.call_type) {
    case CallTypeEnum.MISSED:
      if (call.direction === 'inbound') {
        return `You missed a call from ${call.from}`;
      }
      return `You tried to reach to ${call.to}`;
    case CallTypeEnum.ANSWERED:
      if (call.direction === 'inbound')
        return `You answered a call from ${call.from}`;
      return `You made a call to ${call.to}`;
    case CallTypeEnum.VOICEMAIL:
      if (call.direction === 'inbound')
        return `You received a voicemail from ${call.from}`;
      return `You leaved a voicemail to ${call.to}`;
  }
};

export const getTodayCalls = (calls: CallInterface[]): CallInterface[] => {
  return calls.filter((c) => isToday(new Date(c.created_at)));
};

export const getYesterdayCalls = (calls: CallInterface[]): CallInterface[] => {
  return calls.filter((c) => isYesterday(new Date(c.created_at)));
};

export const getLastWeekCalls = (calls: CallInterface[]): CallInterface[] => {
  return calls.filter((c) => {
    const created = new Date(c.created_at);
    return !isToday(created) && !isYesterday(created) && isLastWeek(created);
  });
};

export const getLastMonthCalls = (calls: CallInterface[]): CallInterface[] => {
  return calls.filter((c) => !isLastWeek(new Date(c.created_at)));
};

export const sortByDate = (
  callA: CallInterface,
  callB: CallInterface
): number => {
  const dateA = Date.parse(callA.created_at);
  const dateB = Date.parse(callB.created_at);

  return dateB - dateA;
};
