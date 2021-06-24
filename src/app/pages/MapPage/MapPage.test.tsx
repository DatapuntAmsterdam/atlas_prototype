/**
 * @jest-environment jsdom-global
 */
import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import MapPage from './MapPage'
import { DataSelectionProvider } from '../../components/DataSelection/DataSelectionContext'
import { UiProvider } from '../../contexts/ui'
import MapProvider from './MapProvider'
import withAppContext from '../../utils/withAppContext'

jest.mock('@amsterdam/react-maps')
jest.mock('./components/MapMarker/MapMarker', () => () => <div data-testid="mapMarkers" />)
jest.mock('./components/MapPanel/MapPanel', () => () => <div data-testid="mapPanel" />)
jest.mock('./components/DrawTool/DrawResults', () => () => <div data-testid="drawResults" />)
jest.mock('./components/PanoramaViewer/PanoramaViewer', () => () => (
  <div data-testid="panoramaViewer" />
))

jest.mock('@amsterdam/arm-core', () => ({
  // @ts-ignore
  ...jest.requireActual('@amsterdam/arm-core'),
  Map: ({ children }: PropsWithChildren<any>) => <div>{children}</div>,
  Scale: ({ children }: PropsWithChildren<any>) => <div data-testid="scale">{children}</div>,
}))

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
    search: 'heading=10&locatie=12.12,3.21',
  }),
}))

describe('MapPage', () => {
  it('should show the PanoramaViewer when panoHeading and locatie parameters are set', async () => {
    render(
      withAppContext(
        <MapProvider>
          <UiProvider>
            <DataSelectionProvider>
              <MapPage />
            </DataSelectionProvider>
          </UiProvider>
        </MapProvider>,
      ),
    )

    const component = await screen.findByTestId('panoramaViewer')
    expect(component).toBeInTheDocument()
  })
})
