import React, { useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN_MUTATION } from './graphql/mutations';
import { StoreContext } from './contexts/store.context';
import {
  LoginResponseInterface,
  LoginParamsInterface,
} from './graphql/interfaces';
import { StoreContextInterface } from './shared/interfaces';
import { isNullOrEmpty } from './shared/utils';

import './App.scss';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [login] = useMutation<LoginResponseInterface>(LOGIN_MUTATION);

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
        storeContext.changeCache({ login: result.data?.login });
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
