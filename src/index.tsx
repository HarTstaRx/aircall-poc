import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import App from './App';
import StoreProvider from './providers/StoreProvider';
import apolloClient from './graphql/apollo.client';

import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ApolloProvider client={apolloClient}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </ApolloProvider>
);
