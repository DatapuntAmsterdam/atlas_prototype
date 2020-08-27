import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import environment from '../environment'
import configureStore from '../store/store'
import App from './App'
import resolveRedirects from './redirects'
import './sentry'

if ('serviceWorker' in navigator) {
  window.navigator.serviceWorker.getRegistrations().then((registrations) => {
    // eslint-disable-next-line prefer-const,no-restricted-syntax
    for (let registration of registrations) {
      registration.unregister()
    }
  })
}

// If there are no redirects for the current url, render the application
resolveRedirects().then((hasToRedirect) => {
  if (!hasToRedirect) {
    const { store } = configureStore()

    renderApp(store)
  }
})

function renderApp(store) {
  // eslint-disable-next-line no-console
  console.log(
    `Dataportaal: version: ${process.env.VERSION}, deploy env: ${environment.DEPLOY_ENV}${
      process.env.GIT_COMMIT ? `, commit: ${process.env.GIT_COMMIT}` : ''
    }`,
  )

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root'),
  )
}
