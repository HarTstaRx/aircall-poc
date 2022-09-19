/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';

import {
  StoreContextInterface,
  CacheInterface,
  SnackbarInterface,
} from '../shared/interfaces';
import { StoreContext } from '../contexts/store.context';

interface Props {
  children: JSX.Element;
}

export default function StoreProvider(props: Props): JSX.Element {
  const { children } = props;

  const changeSnackbar = (snackbar: SnackbarInterface): void => {
    setContext((contextState) => ({
      ...contextState,
      snackbar,
    }));
  };

  const changeCache = (newCache: Partial<CacheInterface>): void => {
    setContext(
      (contextState) =>
        ({
          ...contextState,
          cache: { ...contextState.cache, ...newCache },
        } as StoreContextInterface)
    );
  };

  const [context, setContext] = useState<StoreContextInterface>({
    cache: {},
    snackbar: undefined,
    changeCache,
    changeSnackbar,
  });

  const contextValue = {
    ...context,
    changeCache,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
