import { History } from 'history'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { AnyAction, Store } from 'redux'
import environment from '../environment'
import configureStore from '../store/store'
import App from './App'
import resolveRedirects from './redirects'
import './sentry'

// If there are no redirects for the current url, render the application
resolveRedirects().then((hasToRedirect) => {
  if (!hasToRedirect) {
    const { store, history } = configureStore()

    renderApp(store, history)
  }
})

function renderApp(store: Store<any, AnyAction>, history: History) {
  // eslint-disable-next-line no-console
  console.log(`Dataportaal: version: ${process.env.VERSION}, deploy env: ${environment.DEPLOY_ENV}`)

  ReactDOM.render(
    <Provider store={store}>
      {/* Normally we would use the router from 'react-router-dom', but since we gradually migrate from
      redux-first-router to react-router, we need to share the history */}
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root'),
  )
}
