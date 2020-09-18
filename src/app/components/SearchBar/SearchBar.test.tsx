import { ThemeProvider } from '@datapunt/asc-ui'
import { render } from '@testing-library/react'
import React from 'react'
import SearchBar from './SearchBar'

// Mock the SearchBarFilter component as it's not relevant for this test and is tested seperately
jest.mock('../SearchBarFilter', () => () => <div />)

describe('SearchBar', () => {
  const props = {
    expanded: false,
    searchBarProps: {},
    placeholder: 'Zoek',
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    onChange: jest.fn(),
    onClear: jest.fn(),
    onKeyDown: jest.fn(),
    value: 'foo',
  }

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('should not show the backdrop by default', () => {
    const { queryByTestId } = render(
      <ThemeProvider>
        <SearchBar {...props} />
      </ThemeProvider>,
    )

    expect(queryByTestId('backDrop')).toBeFalsy()
  })

  it('should show the backdrop when the component receives the right props', () => {
    const { queryByTestId } = render(
      <ThemeProvider>
        <SearchBar {...{ ...props, expanded: true }} />
      </ThemeProvider>,
    )

    expect(queryByTestId('backDrop')).toBeTruthy()
  })
})
