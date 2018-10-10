import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import App from './App';
import configureStore from '../store';
import './angularModules';
import reduxWatcher from '../shared/services/redux-watcher/redux-watcher';
import routes from './routes';

const history = createHistory();
const store = configureStore(history, routes);

window.reactHistory = history;

reduxWatcher(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
