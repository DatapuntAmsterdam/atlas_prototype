import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { GlobalStyle, ThemeProvider } from '@datapunt/asc-ui'
import { withA11y } from '@storybook/addon-a11y'
import { Provider } from 'react-redux'
import configureStore from '../src/store/store'
import routes from '../src/app/routes'

addDecorator(withA11y)

// automatically import all files ending in *.stories.jsx or *.stories.tsx
const req = require.context('../src', true, /\.stories\.(j|t)sx$/)

const store = configureStore(true)

const extendedTheme = {
  globalStyle: ``,
}

function withGlobalStyles(storyFn) {
  return (
    <Provider store={store}>
      <ThemeProvider overrides={extendedTheme}>
        <>
          <GlobalStyle />
          {storyFn()}
        </>
      </ThemeProvider>
    </Provider>
  )
}

addDecorator(withGlobalStyles)

configure(req, module)
