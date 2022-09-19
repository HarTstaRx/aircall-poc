import React, { useState } from 'react';
import { Info } from '@mui/icons-material';
import { IconButton, Dialog } from '@mui/material';

import { CallInterface } from '../../graphql/interfaces';
import { CallDetail } from '../call-detail/CallDetail';

import './Call.scss';
import {
  getIconFromCall,
  getCallNumber,
  getCallTime,
  getColorClassname,
} from './call.utils';

interface Props extends CallInterface {
  handleEditNote: (noteId: string) => void;
  handleDeleteNote: (noteId: string) => void;
}

export const Call = (call: Props): JSX.Element => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const handleShowMore = () => {
    setShowDetail(true);
  };

  return (
    <div
      id={call.id}
      className='call'
    >
      <div className='call-left-group'>
        <span className={`call__icon ${getColorClassname(call)}`}>
          {React.createElement(getIconFromCall(call))}
        </span>
        <span className='call__number'>{getCallNumber(call)}</span>
      </div>
      <div className='call-right-group'>
        <span className='call__time'>{getCallTime(call)}</span>
        <span className='call__detail'>
          <IconButton onClick={handleShowMore}>
            <Info />
          </IconButton>
        </span>
      </div>
      <Dialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <CallDetail
          callId={call.id}
          handleEditNote={call.handleEditNote}
          handleDeleteNote={call.handleDeleteNote}
        />
      </Dialog>
    </div>
  );
};
