import { CallTypeEnum } from '../enums/call-type.enum';

export interface CallInterface {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  call_type: CallTypeEnum;
  created_at: string;
}
