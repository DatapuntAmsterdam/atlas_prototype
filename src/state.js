import { compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './map/sagas';
import * as auth from './shared/services/auth/auth';
import { authenticateUser } from './reducers/user';

export default function initialize(Redux, reducer, stateUrlConverter, defaultState, ...middleware) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    Redux.applyMiddleware(...middleware, sagaMiddleware)
  );

  window.reduxStore = createStore(reducer, defaultState, enhancer);

  sagaMiddleware.run(rootSaga);

  try {
    auth.initAuth();
  } catch (error) {
    window.Raven.captureMessage(error);
  }

  const returnPath = auth.getReturnPath();
  if (returnPath) {
    location.hash = returnPath;
  }

  const accessToken = auth.getAccessToken();
  if (accessToken) {
    reduxStore.dispatch(authenticateUser(auth.getAccessToken(), auth.getName(), auth.getScopes()));
  }
}

window.initializeState = initialize;
