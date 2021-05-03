import { History } from 'history'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { AnyAction, Store } from 'redux'
import environment from '../environment'
import configureStore from '../store/store'
import App from './App'
import { UiProvider } from './contexts/ui'
import { disableFeature, enableFeature, getEnabledFeatures } from './features'
import resolveRedirects from './redirects'
import './sentry'

// If there are no redirects for the current url, render the application
resolveRedirects()
  .then((hasToRedirect) => {
    if (!hasToRedirect) {
      const { store, history } = configureStore()

      renderApp(store, history)
    }
  })
  .catch((error: string) => {
    // eslint-disable-next-line no-console
    console.error(`Can't resolve redirects: ${error}`)
  })

function renderApp(store: Store<any, AnyAction>, history: History) {
  // eslint-disable-next-line no-console
  console.info(
    `Dataportaal: version: ${process.env.VERSION as string}, deploy env: ${environment.DEPLOY_ENV}`,
  )

  const enabledFeatures = getEnabledFeatures()

  if (enabledFeatures.length > 0) {
    // eslint-disable-next-line no-console
    console.info(`The following features are enabled: ${enabledFeatures.join(', ')}`)
  }

  ReactDOM.render(
    <Provider store={store}>
      {/* Normally we would use the router from 'react-router-dom', but since we gradually migrate from
      redux-first-router to react-router, we need to share the history */}
      <Router history={history}>
        <UiProvider>
          <App />
        </UiProvider>
      </Router>
    </Provider>,
    document.getElementById('root'),
  )
}

// These functions are aliased to the window so that features can be enabled or disabled by novice users (such as testers)
// To enable a feature they can simply paste `enableFeature('FEATURE_NAME')` or `disableFeature('FEATURE_NAME')` in their console.
// @ts-ignore
window.enableFeature = enableFeature
// @ts-ignore
window.disableFeature = disableFeature
