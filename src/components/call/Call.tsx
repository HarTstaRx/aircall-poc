import React from 'react';
import { Info } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { CallTypeEnum } from '../../graphql/enums/call-type.enum';
import { CallInterface } from '../../graphql/interfaces';

import './Call.scss';
import {
  getIconFromCall,
  getCallNumber,
  getCallTime,
  getColorClassname,
} from './call.utils';

export const Call = (call: CallInterface): JSX.Element => {
  const handleShowMore = () => {
    console.log('show more for', call.id);
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
    </div>
  );
};
