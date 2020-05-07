import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from '../store/store'
import routes from './routes'
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
    const store = configureStore(routes)

    renderApp(store)
  }
})

function renderApp(store) {
  // eslint-disable-next-line no-undef,no-console
  console.log(`CityData: version: ${VERSION}, build: ${process.env.NODE_ENV}`)

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  )
}
