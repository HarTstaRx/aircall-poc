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
