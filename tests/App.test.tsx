import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';

describe('App component', () => {
  const app = renderer.create(<App />);
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
