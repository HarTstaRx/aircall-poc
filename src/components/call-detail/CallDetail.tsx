import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

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

import './CallDetail.scss';
import { getShortDateString, getShortTimeString } from '../call/date.utils';
import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface Props {
  callId: string;
  handleEditNote: (noteId: string) => void;
  handleDeleteNote: (noteId: string) => void;
}
export const CallDetail = ({
  callId,
  handleEditNote,
  handleDeleteNote,
}: Props): JSX.Element => {
  const [getCallDetail, { loading }] =
    useLazyQuery<CallDetailResponseInterface>(CALL_QUERY);
  const [callDetail, setCallDetail] = useState<
    CallDetailInterface | undefined
  >();

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
          <span
            className={`call-detail__icon ${getColorClassname(callDetail)}`}
          >
            {React.createElement(getIconFromCall(callDetail))}
          </span>
          <span className='call-detail__summary'>{getSummary(callDetail)}</span>
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
          {callDetail.notes.length > 0 && (
            <div className='call-detail__notes'>
              <span className='detail__notes__title'>Notes:</span>
              {callDetail.notes.map((note: NoteInterface) => (
                <div
                  key={note.id}
                  className='call-note'
                >
                  <span>{note.content}</span>
                  <IconButton onClick={() => handleEditNote(note.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteNote(note.id)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};