import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@amsterdam/asc-ui'
import type { ReactElement } from 'react'

import configureStore from '../../store/store'

const { store } = configureStore()

/**
 * HOC that wraps a component in the necessary providers so that the component can access theming,
 * the store and can use routing.
 */
const withAppContext = (WrappedComponent: ReactElement) => (
  <ThemeProvider>
    <Provider store={store}>
      <BrowserRouter>{WrappedComponent}</BrowserRouter>
    </Provider>
  </ThemeProvider>
)

export default withAppContext
