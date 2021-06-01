import type { Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { FEATURE_KEYCLOAK_AUTH, isFeatureEnabled } from '../app/features'
import rootReducer from '../shared/ducks/root'
import rootSaga from '../root-saga'
import { authenticateReload } from '../shared/ducks/user/user'
import * as auth from '../shared/services/auth/auth'

const configureStore = (): { store: Store<any> } => {
  const sagaMiddleware = createSagaMiddleware()

  const middleware = [sagaMiddleware]

  const store = createStore(rootReducer(), undefined, applyMiddleware(...middleware))

  if (typeof window !== 'undefined') {
    window.reduxStore = store
  }

  sagaMiddleware.run(rootSaga)

  if (!isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)) {
    try {
      auth.initAuth()
    } catch (error) {
      // Todo: DP-6286 - Add sentry back, log to sentry
      console.warn(error) // eslint-disable-line no-console
    }
  }

  const returnPath = auth.getReturnPath()
  if (returnPath) {
    window.location.href = returnPath
  }

  store.dispatch(authenticateReload())

  return { store }
}

export default configureStore
