import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { MemoryRouter, Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { mocked } from 'ts-jest/utils'
import { ViewMode } from '../shared/ducks/ui/ui'
import App from './App'
import { useIsEmbedded } from './contexts/ui'
import { toNotFound } from './links'
import PAGES from './pages'
import { ROUTER_NAMESPACE } from './routes'
import useParam from './utils/useParam'

// Mock some components because of it's complex dependencies (like using .query files that jest cannot handle)
jest.mock('./components/Header', () => () => <div data-testid="header" />)
jest.mock('./components/SearchBar/SearchBar', () => () => <div data-testid="search-bar" />)

// For some reason we get styled-components console warnings when MapLegend is rendered ("The component styled.div with the id of "sc-xxxxx" has been created dynamically.")
jest.mock('./contexts/ui')
jest.mock('./utils/useParam')

const useIsEmbeddedMock = mocked(useIsEmbedded)
const useParamMock = mocked(useParam)
const mockStore = configureMockStore()
const initialState = {
  ui: {
    isEmbed: false,
    isEmbedPreview: false,
    isPrintMode: false,
    viewMode: ViewMode.Full,
  },
  search: {
    query: '',
  },
  selection: {
    type: '',
  },
  map: {
    view: 'home',
  },
  user: {},
  error: {
    hasErrors: false,
  },
  location: {
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA}`,
  },
  files: {
    fileName: '',
    fileUrl: '',
    type: 'default',
  },
}
const store = mockStore(initialState)

useParamMock.mockReturnValue(['someQuery', () => {}])
useIsEmbeddedMock.mockReturnValue(false)

describe('App', () => {
  it('should redirect to 404 page', () => {
    const mockStore2 = configureMockStore()
    const newStore = mockStore2(
      Object.assign(initialState, { location: { type: 'not-existing-page' } }),
    )

    const history = createMemoryHistory()

    render(
      <Provider store={newStore}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
    )

    expect(history.location).toEqual(expect.objectContaining(toNotFound()))
  })

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    )
    const firstChild = container.firstChild as HTMLElement
    expect(firstChild).toBeDefined()
  })

  it('should render the header', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should render skip navigation buttons (A11Y)', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByTitle('Direct naar: inhoud')).toBeInTheDocument()
    expect(screen.getByTitle('Direct naar: zoeken')).toBeInTheDocument()
    expect(screen.getByTitle('Direct naar: footer')).toBeInTheDocument()
  })
})
