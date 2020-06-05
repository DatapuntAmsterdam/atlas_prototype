import { ThemeProvider } from '@datapunt/asc-ui'
import { render } from '@testing-library/react'
import React from 'react'
import Search from './Search'

describe('Search', () => {
  const onOpenSearchBarToggleMock = jest.fn()
  const props = {
    expanded: false,
    searchBarProps: {},
    openSearchBarToggle: false,
    onOpenSearchBarToggle: onOpenSearchBarToggleMock,
    inputProps: {
      placeholder: 'Zoek',
    },
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should not show the backdrop by default', () => {
    const { queryByTestId } = render(
      <ThemeProvider>
        <Search {...props} />
      </ThemeProvider>,
    )

    expect(queryByTestId('backDrop')).toBeFalsy()
  })

  it('should show the backdrop when the component receives the right props', () => {
    const { queryByTestId } = render(
      <ThemeProvider>
        <Search {...{ ...props, expanded: true }} />
      </ThemeProvider>,
    )

    expect(queryByTestId('backDrop')).toBeTruthy()
  })
})
