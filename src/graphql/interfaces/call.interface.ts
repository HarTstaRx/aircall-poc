import { CallTypeEnum } from '../enums/call-type.enum';
import { NoteInterface } from './note.interface';

export interface CallInterface {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  duration: number;
  via: string;
  is_archived: boolean;
  call_type: CallTypeEnum;
  created_at: string;
  notes: NoteInterface[];
}
