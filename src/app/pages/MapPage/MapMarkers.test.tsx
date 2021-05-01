import { screen, render } from '@testing-library/react'
import withMapContext from '../../utils/withMapContext'
import MapMarkers from './MapMarkers'
import { DataSelectionProvider } from '../../components/DataSelection/DataSelectionContext'

let currentPath = '/kaart'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: currentPath,
    search: '?locatie=123,123',
  }),
}))

jest.mock('../../components/PanoramaViewer/PanoramaViewerMarker', () => () => (
  <div data-testid="panoramaMarker" />
))
jest.mock('./map-search/MapSearchMarker', () => () => <div data-testid="searchMarker" />)

describe('MapMarkers', () => {
  it('should render the search marker when on /kaart, /kaart/geozoek and detail page', () => {
    const { rerender } = render(
      withMapContext(
        <DataSelectionProvider>
          <MapMarkers panoActive={false} />
        </DataSelectionProvider>,
      ),
    )
    expect(screen.getByTestId('searchMarker')).toBeInTheDocument()

    currentPath = '/kaart/geozoek'
    rerender(
      withMapContext(
        <DataSelectionProvider>
          <MapMarkers panoActive={false} />
        </DataSelectionProvider>,
      ),
    )
    expect(screen.getByTestId('searchMarker')).toBeInTheDocument()

    currentPath = '/kaart/bag/buurt/123'
    rerender(
      withMapContext(
        <DataSelectionProvider>
          <MapMarkers panoActive={false} />
        </DataSelectionProvider>,
      ),
    )
    expect(screen.getByTestId('searchMarker')).toBeInTheDocument()
  })

  it('should not render the search marker, but the panorama marker when panoramaviewer is active', () => {
    currentPath = '/kaart/geozoek'
    render(
      withMapContext(
        <DataSelectionProvider>
          <MapMarkers panoActive />
        </DataSelectionProvider>,
      ),
    )
    expect(screen.getByTestId('panoramaMarker')).toBeInTheDocument()
    expect(screen.queryByTestId('searchMarker')).not.toBeInTheDocument()
  })
})
