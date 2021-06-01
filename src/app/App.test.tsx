import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import App from './App'
import { useIsEmbedded } from './contexts/ui'
import { toNotFound } from './links'
import useParam from './utils/useParam'
import withAppContext from './utils/withAppContext'

// Mock some components because of it's complex dependencies (like using .query files that jest cannot handle)
jest.mock('./components/Header', () => () => <div data-testid="header" />)
jest.mock('./components/SearchBar/SearchBar', () => () => <div data-testid="search-bar" />)

// For some reason we get styled-components console warnings when MapLegend is rendered ("The component styled.div with the id of "sc-xxxxx" has been created dynamically.")
jest.mock('./contexts/ui')
jest.mock('./utils/useParam')

const useIsEmbeddedMock = mocked(useIsEmbedded)
const useParamMock = mocked(useParam)

useParamMock.mockReturnValue(['someQuery', () => {}])
useIsEmbeddedMock.mockReturnValue(false)

const historyReplaceMock = jest.fn()
let pathname = '/'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname,
    search: 'heading=10&locatie=12.12,3.21',
  }),
  useHistory: () => ({
    replace: historyReplaceMock,
  }),
}))

describe('App', () => {
  afterEach(() => {
    pathname = '/'
  })

  it('should redirect to 404 page', () => {
    pathname = '/asdfasgasda'
    render(withAppContext(<App />))

    expect(historyReplaceMock).toHaveBeenCalledWith(expect.objectContaining(toNotFound()))
  })

  it('should render', () => {
    const { container } = render(withAppContext(<App />))
    const firstChild = container.firstChild as HTMLElement
    expect(firstChild).toBeDefined()
  })

  it('should render the header', () => {
    render(withAppContext(<App />))
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should render skip navigation buttons (A11Y)', () => {
    render(withAppContext(<App />))
    expect(screen.getByTitle('Direct naar: inhoud')).toBeInTheDocument()
    expect(screen.getByTitle('Direct naar: zoeken')).toBeInTheDocument()
    expect(screen.getByTitle('Direct naar: footer')).toBeInTheDocument()
  })
})
