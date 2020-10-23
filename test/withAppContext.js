import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ThemeProvider } from '@amsterdam/asc-ui'
import '@testing-library/jest-dom'

import configureStore from '../src/store/store'

const { store, history } = configureStore()

const withAppContext = (Component) => (
  <ThemeProvider>
    <Provider store={store}>
      <Router history={history}>{Component}</Router>
    </Provider>
  </ThemeProvider>
)

export default withAppContext
