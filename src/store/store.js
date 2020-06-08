import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { connectRoutes } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'
import queryString from 'querystring'
import rootSaga from '../root-saga'
import '../shared/ducks/error/error-message'
import * as auth from '../shared/services/auth/auth'
import { authenticateReload } from '../shared/ducks/user/user'
import rootReducer from '../reducers/root'
import documentHeadMiddleware from './middleware/documentHead'
import matomoMiddleware from './middleware/matomo/matomoMiddleware'
import urlParamsMiddleware from './middleware/addMetaToRoutesMiddleware'
import preserveUrlParametersMiddleware from './middleware/preserveUrlParametersMiddleware'
import setQueriesFromStateMiddleware from './middleware/setQueriesFromStateMiddleware'
import paramsRegistry from './params-registry'
import './queryParameters'
import routes from '../app/routes'

const configureStore = (storybook = false, req) => {
  const routesMap = routes

  const ssrOptions = req
    ? {
        initialEntries: [req.path],
      }
    : {}

  const routingOptions = {
    querySerializer: queryString,
    restoreScroll: restoreScroll({
      shouldUpdateScroll: (prev, locationState) => {
        return prev.type !== locationState.type
      },
    }),
    initialDispatch: false,
    createHistory: typeof window === 'undefined' ? createMemoryHistory : createBrowserHistory,
    ...ssrOptions,
  }
  const {
    reducer: routeReducer,
    middleware: routeMiddleware,
    enhancer: routeEnhancer,
    initialDispatch: initialRouteDispatch,
    history,
  } = connectRoutes(routesMap, routingOptions)

  paramsRegistry.history = history

  const composeEnhancers =
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose
  const sagaMiddleware = createSagaMiddleware()

  const allMiddleware = [
    preserveUrlParametersMiddleware,
    routeMiddleware,
    urlParamsMiddleware,
    setQueriesFromStateMiddleware,
    documentHeadMiddleware,
    matomoMiddleware,
    sagaMiddleware,
  ]

  let middleware = allMiddleware

  if (storybook) {
    middleware = [routeMiddleware, documentHeadMiddleware, matomoMiddleware, sagaMiddleware]
  }

  const enhancer = composeEnhancers(routeEnhancer, applyMiddleware(...middleware))

  // Element that have a focus should blur on a route change. This prevents issues like
  // having a header menu open when the user navigates
  history.listen(() => {
    if (document.activeElement) {
      document.activeElement.blur()
    }
  })

  const store = createStore(rootReducer(routeReducer), undefined, enhancer)

  if (typeof window !== 'undefined') {
    window.reduxStore = store
  }

  sagaMiddleware.run(rootSaga)

  try {
    auth.initAuth()
  } catch (error) {
    // Todo: DP-6286 - Add sentry back, log to sentry
    console.warn(error) // eslint-disable-line no-console
  }

  const returnPath = auth.getReturnPath()
  if (returnPath) {
    window.location.href = returnPath
  }

  initialRouteDispatch()
  store.dispatch(authenticateReload())

  return store
}

export default configureStore
