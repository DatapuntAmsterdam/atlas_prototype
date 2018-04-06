import { compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './map/sagas';
import './shared/ducks/error-message';
import './map/ducks/click-location/map-click-location';
import * as auth from './shared/services/auth/auth';
import { authenticateUser } from './reducers/user';
import { fetchCatalogFilters } from './catalog/ducks/data-selection/data-selection-catalog';

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
    // Timeout needed because the change is otherwise not being handled in
    // Firefox browsers. This is possibly due to AngularJS changing the
    // `location.hash` at the same time.
    window.setTimeout(() => {
      location.hash = returnPath;
    });
  }

  const accessToken = auth.getAccessToken();
  if (accessToken) {
    window.reduxStore.dispatch(authenticateUser(auth.getAccessToken(), auth.getName(),
      auth.getScopes()));
  }

  window.reduxStore.dispatch(fetchCatalogFilters());
}

window.initializeState = initialize;
