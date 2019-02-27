import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from '../store/store';
import './angularModules';
import routes from './routes';
import resolveRedirects from './redirects';

const store = configureStore(routes);

const hasToRedirect = resolveRedirects();

if (!hasToRedirect) {
  // eslint-disable-next-line no-undef,no-console
  console.log(`CityData: version: ${VERSION}, build: ${__BUILD_ID__}`);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
