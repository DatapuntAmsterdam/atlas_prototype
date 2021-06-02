import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@amsterdam/asc-ui'
import type { ReactElement } from 'react'

/**
 * HOC that wraps a component in the necessary providers so that the component can access theming,
 * the store and can use routing.
 */
const withAppContext = (WrappedComponent: ReactElement) => (
  <ThemeProvider>
    <BrowserRouter>{WrappedComponent}</BrowserRouter>
  </ThemeProvider>
)

export default withAppContext
