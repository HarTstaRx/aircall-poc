import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { CALL_QUERY } from '../../graphql/queries';
import {
  CallDetailResponseInterface,
  NoteInterface,
} from '../../graphql/interfaces';
import { CallDetailInterface } from '../../graphql/interfaces/call-detail.interface';
import {
  getColorClassname,
  getIconFromCall,
  getSummary,
} from '../call/call.utils';
import { getShortDateString, getShortTimeString } from '../call/date.utils';
import { CreateNote } from '..';
import { randomId } from '../../shared/utils';

import './CallDetail.scss';

interface Props {
  callId: string;
}
export const CallDetail = ({ callId }: Props): JSX.Element => {
  const [getCallDetail, { loading }] =
    useLazyQuery<CallDetailResponseInterface>(CALL_QUERY);
  const [callDetail, setCallDetail] = useState<
    CallDetailInterface | undefined
  >();

  const handleCreateNote = (newNoteContent: string) => {
    if (callDetail)
      setCallDetail({
        ...callDetail,
        notes: [
          ...callDetail.notes,
          {
            id: randomId(),
            content: newNoteContent,
          },
        ],
      });
  };

  const handleEditNote = (noteId: string) => {
    console.log('editing', noteId);
  };
  const handleDeleteNote = (noteId: string) => {
    console.log('deleting', noteId);
  };

  useEffect(() => {
    void getCallDetail({ variables: { callId } }).then((result) => {
      if (result.data) setCallDetail(result.data.call);
    });
  }, [callId]);

  return (
    <div
      id={callId}
      className='call-detail'
    >
      {loading && 'Loading...'}
      {callDetail && (
        <>
          <span className='call-detail__title'>
            <span
              className={`call-detail__title__icon ${getColorClassname(
                callDetail
              )}`}
            >
              {React.createElement(getIconFromCall(callDetail))}
            </span>
            <span className='call-detail__title__summary'>
              {getSummary(callDetail)}
            </span>
          </span>
          <span className='call-detail__when'>
            {`When: ${getShortDateString(
              new Date(callDetail.created_at)
            )} at ${getShortTimeString(new Date(callDetail.created_at))}`}
          </span>
          <span className='call-detail__from'>From: {callDetail.from}</span>
          <span className='call-detail__to'>To: {callDetail.to}</span>
          {callDetail.is_archived && (
            <span className='call-detail__archived'>This call is archived</span>
          )}
          <span className='call-detail__via'>
            This call was made via {callDetail.via}
          </span>
          <div className='call-detail__notes'>
            <span className='call-detail__notes__title'>Notes:</span>
            {callDetail.notes.map((note: NoteInterface) => (
              <div
                key={note.id}
                className='call-note'
              >
                <span>{note.content}</span>
                <span className='call-note__actions'>
                  <IconButton onClick={() => handleEditNote(note.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteNote(note.id)}>
                    <Delete />
                  </IconButton>
                </span>
              </div>
            ))}
            {callDetail.notes.length === 0 && (
              <div className='call-detail__notes__empty'>
                There are currently no notes for this call. Add one!
              </div>
            )}
            <CreateNote handleCreateNote={handleCreateNote} />
          </div>
        </>
      )}
    </div>
  );
};
