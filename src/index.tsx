import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';

import App from './App';
import StoreProvider from './providers/StoreProvider';
import apolloClient from './graphql/apollo.client';
import theme from './styles/material-theme';

import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ApolloProvider client={apolloClient}>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </ApolloProvider>
);
