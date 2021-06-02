import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import environment from '../environment'
import { initAuth, getReturnPath } from '../shared/services/auth/auth'
import { initKeycloak } from '../shared/services/auth/auth-keycloak'
import App from './App'
import { UiProvider } from './contexts/ui'
import {
  disableFeature,
  enableFeature,
  FEATURE_KEYCLOAK_AUTH,
  getEnabledFeatures,
  isFeatureEnabled,
} from './features'
import resolveRedirects from './redirects'
import './sentry'

// Able to enable and disable feature-toggles via URL parameters
const searchParams = new URLSearchParams(window.location.search)

if (searchParams.has('enableFeature')) {
  enableFeature(searchParams.get('enableFeature') as string)
}

if (searchParams.has('disableFeature')) {
  disableFeature(searchParams.get('disableFeature') as string)
}

resolveRedirects(window.location)
  .then((hasToRedirect) => {
    // Don't do any bootstrapping if we have to redirect.
    if (hasToRedirect) {
      return
    }

    const useKeycloak = isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)

    // If Keycloak is not enabled then initialize AuthZ.
    if (!useKeycloak) {
      try {
        initAuth()
      } catch (error) {
        console.warn(error) // eslint-disable-line no-console
      }
    }

    const returnPath = getReturnPath()

    // Return to the original path where the user started authentication.
    if (returnPath) {
      window.location.href = returnPath
    }

    // Initialize Keycloak if enabled.
    if (useKeycloak) {
      return initKeycloak().then(() => renderApp())
    }

    renderApp()
  })
  .catch((error: string) => {
    // eslint-disable-next-line no-console
    console.error(`Can't resolve redirects: ${error}`)
  })

function renderApp() {
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
    <BrowserRouter>
      <UiProvider>
        <App />
      </UiProvider>
    </BrowserRouter>,
    document.getElementById('root'),
  )
}

// These functions are aliased to the window so that features can be enabled or disabled by novice users (such as testers)
// To enable a feature they can simply paste `enableFeature('FEATURE_NAME')` or `disableFeature('FEATURE_NAME')` in their console.
// @ts-ignore
window.enableFeature = enableFeature
// @ts-ignore
window.disableFeature = disableFeature
