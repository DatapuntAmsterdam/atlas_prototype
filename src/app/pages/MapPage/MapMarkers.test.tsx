import { render } from '@testing-library/react'
import withMapContext from '../../utils/withMapContext'
import MapMarkers from './MapMarkers'

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
  it('should show the search marker when on /kaart/geozoek or /kaart', () => {
    const { getByTestId, rerender } = render(withMapContext(<MapMarkers panoActive={false} />))
    expect(getByTestId('searchMarker')).not.toBeNull()

    currentPath = '/kaart/geozoek'
    rerender(withMapContext(<MapMarkers panoActive={false} />))
    expect(getByTestId('searchMarker')).not.toBeNull()
  })

  it('should not show the search marker on detail page', () => {
    currentPath = '/kaart/bag/pand/123'
    const { queryByTestId } = render(withMapContext(<MapMarkers panoActive={false} />))
    expect(queryByTestId('searchMarker')).toBeNull()
  })

  it('should not show the search marker, but the panorama marker when panoramaviewer is active', () => {
    currentPath = '/kaart/geozoek'
    const { getByTestId, queryByTestId } = render(withMapContext(<MapMarkers panoActive />))
    expect(getByTestId('panoramaMarker')).not.toBeNull()
    expect(queryByTestId('searchMarker')).toBeNull()
  })
})
