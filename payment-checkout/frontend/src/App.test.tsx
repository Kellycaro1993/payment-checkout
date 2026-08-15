import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import App from './App';
import { store } from './app/store';

describe('App', () => {
  it('renderiza la aplicación', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(container).toBeTruthy();
  });
});
