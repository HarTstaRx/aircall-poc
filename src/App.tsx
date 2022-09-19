import React, { useContext, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';

import { LOGIN_MUTATION } from './graphql/mutations';
import { PAGINATED_CALLS_QUERY } from './graphql/queries';
import {
  LoginResponseInterface,
  LoginParamsInterface,
  PaginatedCallsResponseInterface,
} from './graphql/interfaces';
import { StoreContextInterface } from './shared/interfaces';
import { StoreContext } from './contexts/store.context';
import { ACCESS_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from './constants';
import { isNullOrEmpty } from './shared/utils';

import './App.scss';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [login] = useMutation<LoginResponseInterface>(LOGIN_MUTATION);
  const [paginatedCalls] = useLazyQuery<PaginatedCallsResponseInterface>(
    PAGINATED_CALLS_QUERY
  );

  useEffect(() => {
    const loginParams: LoginParamsInterface = {
      input: {
        username: 'test',
        password: 'test123.',
      },
    };
    login({ variables: loginParams })
      .then((result) => {
        console.log('Login success!', result.data);
        sessionStorage.setItem(
          ACCESS_TOKEN_STORAGE,
          result.data?.login.access_token ?? ''
        );
        sessionStorage.setItem(
          REFRESH_TOKEN_STORAGE,
          result.data?.login.refresh_token ?? ''
        );
        storeContext.changeCache({ login: result.data?.login });
        paginatedCalls()
          .then((result) => {
            console.log('callsResult', result.data);
          })
          .catch((error) => console.log('error on paginatedCalls', error));
      })
      .catch((error) => console.log('error on login', error));
  }, []);

  const access_token = storeContext.cache.login?.access_token;

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Phone Application - Proof of concept for Aircall</h1>
      </header>
      <main>
        Access token: {isNullOrEmpty(access_token) ? '' : access_token}
      </main>
      <footer>Proof of concept by David Díez for Aircall</footer>
    </div>
  );
}

export default App;
