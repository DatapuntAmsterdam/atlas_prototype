import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { connectRoutes } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';
import queryString from 'querystring';
import rootSaga from '../root-saga';
import '../shared/ducks/error/error-message';
import * as auth from '../shared/services/auth/auth';
import { authenticateReload } from '../shared/ducks/user/user';
import rootReducer from '../reducers/root';
import documentHeadMiddleware from './middleware/documentHead';
import piwikMiddleware from './middleware/piwik/piwikMiddleware';
import urlParamsMiddleware from './middleware/addMetaToRoutesMiddleware';
import preserveUrlParametersMiddleware from './middleware/preserveUrlParametersMiddleware';
import setQueriesFromStateMiddleware from './middleware/setQueriesFromStateMiddleware';
import paramsRegistry from '../store/params-registry';
import './queryParameters';

window.reducer = rootReducer;
const configureStore = (routesMap) => {
  const routingOptions = {
    querySerializer: queryString,
    restoreScroll: restoreScroll(),
    initialDispatch: false,
    createHistory
  };
  const {
    reducer: routeReducer,
    middleware: routeMiddleware,
    enhancer: routeEnhancer,
    initialDispatch: initialRouteDispatch,
    history
  } = connectRoutes(
    routesMap,
    routingOptions
  );


  paramsRegistry.history = history;

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    routeEnhancer,
    applyMiddleware(
      preserveUrlParametersMiddleware,
      routeMiddleware,
      urlParamsMiddleware,
      setQueriesFromStateMiddleware,
      documentHeadMiddleware,
      piwikMiddleware,
      sagaMiddleware
    )
  );

  window.reduxStore = createStore(rootReducer(routeReducer), undefined, enhancer);

  sagaMiddleware.run(rootSaga);

  try {
    auth.initAuth();
  } catch (error) {
    // Todo: DP-6286 - Add sentry back, log to sentry
    console.warn(error); // eslint-disable-line no-console
  }


  const returnPath = auth.getReturnPath();
  if (returnPath) {
    location.href = returnPath;
  }

  initialRouteDispatch();
  window.reduxStore.dispatch(authenticateReload());

  return window.reduxStore;
};

export default configureStore;
