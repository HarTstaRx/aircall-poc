import { CallInterface } from '.';
import { NoteInterface } from './note.interface';

export interface CallDetailInterface extends CallInterface {
  duration: number;
  via: string;
  notes: NoteInterface[];
}
