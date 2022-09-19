import { NoteInterface } from './note.interface';

export interface CallInterface {
  id: string;
  direction: string;
  from: string;
  to: string;
  duration: number;
  via: string;
  is_archived: boolean;
  call_type: string;
  created_at: Date;
  notes: NoteInterface[];
}
