import React, { useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN_MUTATION } from './graphql/mutations';
import {
  LoginResponseInterface,
  LoginParamsInterface,
} from './graphql/interfaces';
import { SnackbarInterface, StoreContextInterface } from './shared/interfaces';
import { StoreContext } from './contexts/store.context';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from './constants';
import { CallList } from './components';

import './App.scss';
import { SimpleSnackbar } from './components/snackbar/SimpleSnackbar';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [login] = useMutation<LoginResponseInterface>(LOGIN_MUTATION);

  const setShowSnackbar = (snackbar: SnackbarInterface): void => {
    if (storeContext) storeContext.changeSnackbar(snackbar);
  };

  useEffect(() => {
    const loginParams: LoginParamsInterface = {
      input: {
        username: 'test',
        password: 'test123.',
      },
    };
    login({ variables: loginParams })
      .then((result) => {
        sessionStorage.setItem(
          ACCESS_TOKEN_STORAGE,
          result.data?.login.access_token ?? ''
        );
        sessionStorage.setItem(
          REFRESH_TOKEN_STORAGE,
          result.data?.login.refresh_token ?? ''
        );
        storeContext.changeCache({ login: result.data?.login });
      })
      .catch((error) => console.log('error on login', error));
  }, []);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Phone Application - Proof of concept for Aircall</h1>
      </header>
      <main>
        <CallList />
      </main>
      <footer>Proof of concept by David Díez for Aircall</footer>
      {storeContext && storeContext.snackbar && (
        <SimpleSnackbar
          snackbar={storeContext.snackbar}
          setShowSnackbar={setShowSnackbar}
        />
      )}
    </div>
  );
}

export default App;
