import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { GlobalStyle, ThemeProvider } from '@datapunt/asc-ui'
import { withA11y } from '@storybook/addon-a11y'
import { Provider } from 'react-redux'
import configureStore from '../src/store/store'
import routes from '../src/app/routes'
import ReduxContext from '../src/store/reduxContext'
import main, { initialState } from '../src/app/react-reducers'
import { AppStateProvider } from '../src/app/utils/useAppReducer'

addDecorator(withA11y)

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.jsx$/)

const store = configureStore(routes, true)

const extendedTheme = {
  globalStyle: `
  `,
}

function withGlobalStyles(storyFn) {
  return (
    <Provider store={store}>
      <ReduxContext.Provider value={store}>
        <AppStateProvider initialState={initialState} reducer={main}>
          <ThemeProvider overrides={extendedTheme}>
            <>
              <GlobalStyle />
              {storyFn()}
            </>
          </ThemeProvider>
        </AppStateProvider>
      </ReduxContext.Provider>
    </Provider>
  )
}

addDecorator(withGlobalStyles)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
