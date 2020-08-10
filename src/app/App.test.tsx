import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import App from './App'
import { VIEW_MODE } from '../shared/ducks/ui/ui'
import { ROUTER_NAMESPACE } from './routes'
import PAGES from './pages'

// Mock the Header component because of it's complex dependencies (like using .query files that jest cannot handle)
jest.mock('./components/Header', () => () => <div data-testid="header" />)

// For some reason we get styled-components console warnings when MapLegend is rendered ("The component styled.div with the id of "sc-xxxxx" has been created dynamically.")
jest.mock('../map/components/legend/MapLegend')

const mockStore = configureMockStore()
const initialState = {
  ui: {
    isEmbed: false,
    isEmbedPreview: false,
    isPrintMode: false,
    viewMode: VIEW_MODE.FULL,
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
}
const store = mockStore(initialState)

describe('App', () => {
  it('should redirect to 404 page', () => {
    const mockStore2 = configureMockStore()
    const newStore = mockStore2(
      Object.assign(initialState, { location: { type: 'not-existing-page' } }),
    )
    const replaceMock = jest.fn()
    delete window.location
    // @ts-ignore
    window.location = { replace: replaceMock }

    render(
      <Provider store={newStore}>
        {/*
        // @ts-ignore */}
        <App />
      </Provider>,
    )
    expect(replaceMock).toHaveBeenCalled()
  })

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        {/*
        // @ts-ignore */}
        <App />
      </Provider>,
    )
    const firstChild = container.firstChild as HTMLElement
    expect(firstChild).toBeDefined()
  })

  it('should render the header', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        {/*
        // @ts-ignore */}
        <App />
      </Provider>,
    )
    expect(getByTestId('header')).toBeDefined()
  })

  it('should render skip navigation buttons (A11Y)', () => {
    const { getByTitle } = render(
      <Provider store={store}>
        {/*
        // @ts-ignore */}
        <App />
      </Provider>,
    )
    expect(getByTitle('Direct naar: inhoud')).toBeDefined()
    expect(getByTitle('Direct naar: zoeken')).toBeDefined()
    expect(getByTitle('Direct naar: footer')).toBeDefined()
  })
})
