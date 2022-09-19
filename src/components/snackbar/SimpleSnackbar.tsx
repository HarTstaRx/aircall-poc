/* eslint-disable no-nested-ternary */
import React from 'react';
import { Snackbar, Icon, IconButton } from '@mui/material';

import './Snackbar.scss';
import { SnackbarInterface } from '../../shared/interfaces';

interface Props {
  snackbar: SnackbarInterface;
  setShowSnackbar: (snackbar: SnackbarInterface) => void;
}

export function SimpleSnackbar({
  snackbar,
  setShowSnackbar,
}: Props): JSX.Element {
  const handleClose = (): void =>
    setShowSnackbar({ ...snackbar, isVisible: false });

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={snackbar.isVisible}
      className={
        snackbar.type === 'error'
          ? 'error'
          : snackbar.type === 'success'
          ? 'success'
          : snackbar.type === 'warning'
          ? 'warning'
          : snackbar.type === 'info'
          ? 'info'
          : ''
      }
      autoHideDuration={snackbar.type === 'error' ? undefined : 6000}
      onClose={snackbar.type === 'error' ? undefined : handleClose}
      ContentProps={{ 'aria-describedby': 'message-id' }}
      message={
        <div className='text-snackbar'>
          <div className='text-snackbar__title'>{snackbar.title}</div>
          <div className='text-snackbar__message'>{snackbar.message}</div>
        </div>
      }
      action={[
        <IconButton
          key='close'
          onClick={(): void => handleClose()}
        >
          <Icon>close</Icon>
        </IconButton>,
      ]}
    />
  );
}
