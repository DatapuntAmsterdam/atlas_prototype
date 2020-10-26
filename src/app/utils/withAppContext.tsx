import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ThemeProvider } from '@amsterdam/asc-ui'
import '@testing-library/jest-dom'

import configureStore from '../../store/store'

const { store, history } = configureStore()

/**
 * HOC that wraps a component in the necessary providers so that the component can access theming,
 * the store and can use routing.
 */
const withAppContext = (WrappedComponent: ReactElement) => (
  <ThemeProvider>
    <Provider store={store}>
      <Router history={history}>{WrappedComponent}</Router>
    </Provider>
  </ThemeProvider>
)

export default withAppContext
