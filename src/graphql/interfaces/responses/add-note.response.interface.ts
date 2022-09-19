import { NoteInterface } from '../note.interface';

export interface AddNoteResponseInterface {
  addNote: {
    notes: NoteInterface[];
  };
}
