import { createContext } from 'react';

import { StoreContextInterface } from '../shared/interfaces';

export const StoreContext = createContext<StoreContextInterface>({
  cache: {},
  snackbar: { type: 'info', title: '', message: '', isVisible: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeCache: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeSnackbar: () => {},
});
