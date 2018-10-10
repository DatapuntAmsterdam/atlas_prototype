import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRoutes } from 'redux-first-router';
import queryString from 'querystring';
import rootSaga from './root-saga';
import './shared/ducks/error-message';
import * as auth from './shared/services/auth/auth';
import { authenticateUser } from './reducers/user';
import { fetchCatalogFilters } from './catalog/ducks/data-selection/data-selection-catalog';
import rootReducer from './reducers/root';
import stateUrlConverter from './shared/services/routing/state-url-converter';
import { isDevelopment } from './shared/environment';
import freeze from './shared/services/freeze/freeze';
import contextMiddleware from './shared/services/context/context-middleware';

window.reducer = rootReducer;

const configureStore = (history, routes) => {
  const {
    reducer: routeReducer,
    middleware: routeMiddleware,
    enhancer: routeEnhancer,
    initialDispatch: initialRouteDispatch
  } = connectRoutes(history, routes, {
    querySerializer: queryString,
    initialDispatch: false
  });
  const urlDefaultState = stateUrlConverter.getDefaultState();
  const defaultState = isDevelopment() ? freeze(urlDefaultState) : urlDefaultState;

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    routeEnhancer,
    applyMiddleware(
      contextMiddleware,
      routeMiddleware,
      sagaMiddleware)
  );

  window.reduxStore = createStore(rootReducer(routeReducer), defaultState, enhancer);

  sagaMiddleware.run(rootSaga);
  initialRouteDispatch();

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

  return window.reduxStore;
};

export default configureStore;
