import { CallInterface } from '.';
import { NoteInterface } from './note.interface';

export interface CallDetailInterface extends CallInterface {
  duration: number;
  via: string;
  is_archived: boolean;
  notes: NoteInterface[];
}
