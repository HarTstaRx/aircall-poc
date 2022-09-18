import React, { useContext, useEffect } from 'react';

import { StoreContextInterface } from './shared/interfaces';
import { StoreContext } from './contexts/store.context';

import './App.scss';

function App(): JSX.Element {
  const storeContext = useContext<StoreContextInterface>(StoreContext);

  useEffect(() => {
    console.log('App rendered. Cache is:', JSON.stringify(storeContext.cache));
  }, []);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Phone Application - Proof of concept for Aircall</h1>
      </header>
      <main>Content Here</main>
      <footer>Proof of concept by David Díez for Aircall</footer>
    </div>
  );
}

export default App;
