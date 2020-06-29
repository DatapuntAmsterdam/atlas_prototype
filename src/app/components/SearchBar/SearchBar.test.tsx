import { ThemeProvider } from '@datapunt/asc-ui'
import { render } from '@testing-library/react'
import React from 'react'
import SearchBar from './SearchBar'
import { CmsType } from '../../../shared/config/cms.config'

// Mock the SearchBarFilter component as it's not relevant for this test and is tested seperately
jest.mock('../SearchBarFilter', () => () => <div />)

const ARTICLE = 'article' as typeof CmsType.Article

describe('SearchBar', () => {
  const onOpenSearchBarToggleMock = jest.fn()
  const props = {
    expanded: false,
    searchBarProps: {},
    openSearchBarToggle: false,
    onOpenSearchBarToggle: onOpenSearchBarToggleMock,
    placeholder: 'Zoek',
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    onChange: jest.fn(),
    onClear: jest.fn(),
    searchCategory: ARTICLE,
    setSearchCategory: jest.fn(),
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
