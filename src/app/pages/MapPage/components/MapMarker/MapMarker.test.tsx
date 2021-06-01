import { render, screen } from '@testing-library/react'
import { useMapInstance } from '@amsterdam/react-maps'
import { useEffect } from 'react'
import withMapContext from '../../../../utils/withMapContext'
import MapMarker from './MapMarker'
import * as nearestDetail from '../../legacy/services/nearest-detail/nearest-detail'
import { DrawerState } from '../DrawerOverlay'

let currentPath = '/data'

const pushMock = jest.fn()

let search = '?locatie=123,123'

jest.mock('../../../../utils/useMapCenterToMarker', () => () => ({
  panToWithPanelOffset: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: pushMock,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search,
  }),
}))

jest.mock('../../components/PanoramaViewer/PanoramaViewerMarker', () => () => (
  <div data-testid="panoramaMarker" />
))

describe('MapMarker', () => {
  afterEach(() => {
    jest.clearAllMocks()
    search = '?locatie=123,123'
  })

  it('should not show the markers on the map when position is null', () => {
    search = ''
    const { container } = render(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
    expect(screen.queryByTestId('panoramaMarker')).not.toBeInTheDocument()
  })

  it('should not show the marker on the map when user is on detail page', () => {
    const { container, rerender } = render(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).not.toBeNull()

    currentPath = '/data/bag/buurt/id123'
    rerender(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
  })

  it('should show the panoramaMarker on the map when panorama is active', () => {
    render(withMapContext(<MapMarker panoActive />))
    expect(screen.getByTestId('panoramaMarker')).toBeInTheDocument()
  })

  it('navigate to geozoek page when user clicks on the map without an active layer', () => {
    currentPath = '/data/'
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent('click', {
          latlng: {
            lat: 789,
            lng: 987,
          },
        })
      }, [])
      return <MapMarker panoActive={false} />
    }
    render(withMapContext(<Component />))
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/data/geozoek/',
      search: 'locatie=789%2C987',
    })
  })

  it('navigate to detail page when user clicks on the map with an active layer', async () => {
    currentPath = '/data/'
    jest
      .spyOn(nearestDetail, 'default')
      .mockReturnValue(Promise.resolve({ type: 'bag', subType: 'woonplaats', id: '123' } as any))
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent('click', {
          latlng: {
            lat: 789,
            lng: 987,
          },
        })
      }, [])
      return <MapMarker panoActive={false} />
    }
    render(
      withMapContext(<Component />, {
        legendLeafletLayers: [{ layer: { detailUrl: '/geozoek/bag', minZoom: 6 } }] as any,
      }),
    )
    await Promise.resolve()

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/data/bag/woonplaats/123/',
      search: 'locatie=789%2C987',
    })
  })

  it('should open the map panel when user clicks on the map', async () => {
    const setDrawerStateMock = jest.fn()
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent('click', {
          latlng: {
            lat: 789,
            lng: 987,
          },
        })
      }, [])
      return <MapMarker panoActive={false} />
    }
    render(
      withMapContext(<Component />, {
        setDrawerState: setDrawerStateMock,
      }),
    )
    await Promise.resolve()

    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)
  })
})
