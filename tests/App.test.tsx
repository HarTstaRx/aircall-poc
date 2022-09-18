import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { LOGIN_MUTATION } from '../src/graphql/mutations';

import App from '../src/App';

describe('App component', () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: {
          input: {
            username: 'test',
            password: 'test123.',
          },
        },
      },
      result: {
        data: {
          access_token: 'access_token',
          refresh_token: 'refresh_token',
        },
      },
    },
  ];
  const app = renderer.create(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
    >
      <App />
    </MockedProvider>
  );
  const tree = app.toJSON();

  it('should be rendered', () => {
    expect(tree).toMatchSnapshot();
  });

  it('should render a footer tag', () => {
    const footer = app.root.findByType('footer');
    expect(footer).toBeDefined();
    expect(footer.props.children).toBe(
      'Proof of concept by David Díez for Aircall'
    );
  });
});
