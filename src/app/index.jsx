import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import App from './App';
import configureStore from '../store/store';
import './angularModules';
import routes from './routes';

const history = createHistory();
const store = configureStore(history, routes);

window.reactHistory = history;

// eslint-disable-next-line no-undef,no-console
console.log(`CityData: version: ${VERSION}, build: ${__BUILD_ID__}`);
// eslint-disable-next-line no-undef,no-console
console.log(`public url: ${process.env.PUBLIC_URL}`);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
