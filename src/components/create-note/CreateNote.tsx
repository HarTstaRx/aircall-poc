import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import { isNullOrEmpty } from '../../shared/utils';

interface Props {
  handleCreateNote: (newNoteContent: string) => void;
  loading?: boolean;
}
export const CreateNote = ({
  handleCreateNote,
  loading,
}: Props): JSX.Element => {
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  return (
    <div className='call-detail__notes__add'>
      <input
        type='text'
        value={newNoteContent}
        onChange={(evt) => setNewNoteContent(evt.target.value)}
      />
      <IconButton
        onClick={() => {
          if (isNullOrEmpty(newNoteContent)) return;
          handleCreateNote(newNoteContent);
          setNewNoteContent('');
        }}
        disabled={isNullOrEmpty(newNoteContent) || loading}
      >
        <Add />
      </IconButton>
    </div>
  );
};
