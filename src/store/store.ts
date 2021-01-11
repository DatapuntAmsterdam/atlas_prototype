import { createBrowserHistory, createMemoryHistory, History } from 'history'
import queryString from 'querystring'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRoutes, Options as RoutingOptions } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'
import createSagaMiddleware from 'redux-saga'
import routes from '../app/routes'
import rootReducer from '../reducers/root'
import rootSaga from '../root-saga'
import { authenticateReload } from '../shared/ducks/user/user'
import * as auth from '../shared/services/auth/auth'
import urlParamsMiddleware from './middleware/addMetaToRoutesMiddleware'
import documentHeadMiddleware from './middleware/documentHead'
import matomoMiddleware from './middleware/matomo/matomoMiddleware'
import preserveUrlParametersMiddleware from './middleware/preserveUrlParametersMiddleware'
import setQueriesFromStateMiddleware from './middleware/setQueriesFromStateMiddleware'
import paramsRegistry from './params-registry'
import './queryParameters'

const configureStore = () => {
  const routesMap = routes
  const routingOptions: RoutingOptions = {
    querySerializer: queryString,
    restoreScroll: restoreScroll({
      shouldUpdateScroll: (prev, locationState) => {
        return prev.type !== locationState.type
      },
    }),
    initialDispatch: false,
    createHistory: typeof window === 'undefined' ? createMemoryHistory : createBrowserHistory,
  }

  const routeConnector = connectRoutes(routesMap, routingOptions)
  const { history } = (routeConnector as unknown) as { history: History }

  paramsRegistry.history = history

  const sagaMiddleware = createSagaMiddleware()

  const middleware = [
    // Todo AfterBeta remove from here
    preserveUrlParametersMiddleware,
    routeConnector.middleware,
    urlParamsMiddleware,
    setQueriesFromStateMiddleware,
    // Until here
    documentHeadMiddleware,
    matomoMiddleware,
    sagaMiddleware,
  ]

  const enhancer = composeWithDevTools(routeConnector.enhancer, applyMiddleware(...middleware))
  const store = createStore(rootReducer(routeConnector.reducer), undefined, enhancer)

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

  routeConnector.initialDispatch?.()
  store.dispatch(authenticateReload())

  return { store, history }
}

export default configureStore
