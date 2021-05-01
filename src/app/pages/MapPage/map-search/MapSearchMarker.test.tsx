import { useEffect } from 'react'
import { useMapInstance } from '@amsterdam/react-maps'
import { render } from '@testing-library/react'
import withMapContext from '../../../utils/withMapContext'
import MapSearchMarker from './MapSearchMarker'
import * as nearestDetail from '../../../../map/services/nearest-detail/nearest-detail'

let currentPath = '/kaart'

const pushMock = jest.fn()

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: pushMock,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search: '?locatie=123,123',
  }),
}))

describe('MapSearchMarker', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not show the marker on the map when position is null', () => {
    const { container } = render(withMapContext(<MapSearchMarker position={null} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
  })

  it('should not show the marker on the map when user is on detail page', () => {
    const { container, rerender } = render(
      withMapContext(<MapSearchMarker position={{ lat: 123, lng: 321 }} />),
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).not.toBeNull()

    currentPath = '/kaart/bag/buurt/id123'
    rerender(withMapContext(<MapSearchMarker position={{ lat: 123, lng: 321 }} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
  })

  it('navigate to geozoek page when user clicks on the map without an active layer', () => {
    currentPath = '/kaart/'
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
      return <MapSearchMarker position={{ lat: 123, lng: 321 }} />
    }
    render(withMapContext(<Component />))
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/kaart/geozoek/',
      search: 'locatie=789%2C987',
    })
  })

  it('navigate to detail page when user clicks on the map with an active layer', async () => {
    currentPath = '/kaart/'
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
      return <MapSearchMarker position={{ lat: 123, lng: 321 }} />
    }
    render(
      withMapContext(<Component />, {
        legendLeafletLayers: [{ layer: { detailUrl: '/geozoek/bag', minZoom: 6 } }] as any,
      }),
    )
    await Promise.resolve()

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/data/bag/woonplaats/123/',
      search: '?locatie=123,123',
    })
  })
})
