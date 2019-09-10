import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { GlobalStyle, ThemeProvider } from '@datapunt/asc-ui'

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.jsx$/)

const extendedTheme = {
  globalStyle: `
  `,
}

function withGlobalStyles(storyFn) {
  return (
    <ThemeProvider overrides={extendedTheme}>
      <>
        <GlobalStyle />
        {storyFn()}
      </>
    </ThemeProvider>
  )
}

addDecorator(withGlobalStyles)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
