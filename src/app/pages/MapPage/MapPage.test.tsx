import React from 'react'
import { act, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import * as armCore from '@amsterdam/arm-core'
import { Provider } from 'react-redux'
import * as reactRouter from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import MapPage from './MapPage'
import MapContext, { initialState } from './MapContext'
import withAppContext from '../../utils/withAppContext'

jest.mock('./MapControls', () => () => <span data-testid="mapControls" />)
jest.mock('./MapPanelContent', () => () => <div data-testid="mapPanelContent" />)
jest.mock('./draw/DrawResults', () => () => <span data-testid="drawResults" />)
// jest.mock('@amsterdam/arm-core', () => ({ Map: () => <div data-testid="component" /> }))

// jest.mock('react-redux', () => ({
//   useSelector: jest.fn(() => []),
// }))

// jest.mock('redux-first-router-link', () => () => null)

const mockedReactRouter = mocked(reactRouter, true)
//
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom').default,
//   useHistory: () => ({
//     push: jest.fn(),
//   }),
//   useLocation: () => ({
//     search: '',
//   }),
// }))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const store = configureMockStore()({
  user: {
    scopes: [],
  },
})
describe('MapPage', () => {
  // @ts-ignore
  // mockedReactRouter.useLocation = jest.fn(() => ({
  //   search: 'foo',
  // }))
  console.log(mockedReactRouter.useLocation)
  // @ts-ignore
  mockedReactRouter.mockReturnValueOnce({
    // @ts-ignore
    useLocation: jest.fn(() => ({ search: 'asdsda' })),
  })

  act(() => {
    const { getByTestId } = render(
      withAppContext(
        <div>
          <MapContext.Provider
            value={{
              ...initialState,
              panoFullScreen: false,
            }}
          >
            <MapPage />
          </MapContext.Provider>
        </div>,
      ),
    )

    const component = getByTestId('mapControls')
    expect(component).toBe(true)
  })
})
