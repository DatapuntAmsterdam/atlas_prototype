/**
 * @jest-environment jsdom-global
 */
import { render } from '@testing-library/react'
import MapPage from './MapPage'
import MapContext, { initialState } from './MapContext'
import withAppContext from '../../utils/withAppContext'

jest.mock('./MapMarkers', () => () => <div data-testid="mapMarkers" />)
jest.mock('./MapControls', () => () => <div data-testid="mapControls" />)
jest.mock('./MapPanelContent', () => () => <div data-testid="mapPanelContent" />)
jest.mock('./draw/DrawResults', () => () => <div data-testid="drawResults" />)
jest.mock('../../components/PanoramaViewer/PanoramaViewer', () => () => (
  <div data-testid="panoramaViewer" />
))

jest.mock('@amsterdam/arm-core', () => ({
  // @ts-ignore
  ...jest.requireActual('@amsterdam/arm-core'),
  Map: ({ children }) => <div>{children}</div>,
}))

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: 'pano={"foo":"bar"}',
  }),
}))

describe('MapPage', () => {
  it('should show map controls when panorama is not in full screen mode', async () => {
    const { findByTestId } = render(
      withAppContext(
        <MapContext.Provider
          value={{
            ...initialState,
            panoFullScreen: false,
          }}
        >
          <MapPage />
        </MapContext.Provider>,
      ),
    )

    const component = await findByTestId('mapControls')
    expect(component).toBeDefined()
  })

  it('should show the PanoramaViewer when pano parameters are set', async () => {
    const { findByTestId } = render(
      withAppContext(
        <MapContext.Provider value={initialState}>
          <MapPage />
        </MapContext.Provider>,
      ),
    )

    const component = await findByTestId('panoramaViewer')
    expect(component).toBeDefined()
  })
})
