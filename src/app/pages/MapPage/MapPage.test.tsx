/**
 * @jest-environment jsdom-global
 */
import { render } from '@testing-library/react'
import MapPage from './MapPage'
import MapContext, { initialState } from './MapContext'
import withAppContext from '../../utils/withAppContext'

jest.mock('./MapMarkers', () => () => <div data-testid="mapMarkers" />)
jest.mock('./components/MapPanel/MapPanel', () => () => <div data-testid="mapPanel" />)
jest.mock('./components/DrawTool/DrawResults', () => () => <div data-testid="drawResults" />)
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
    search: 'heading=10&locatie=12.12,3.21',
  }),
}))

describe('MapPage', () => {
  it('should show the PanoramaViewer when panoHeading and locatie parameters are set', async () => {
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
