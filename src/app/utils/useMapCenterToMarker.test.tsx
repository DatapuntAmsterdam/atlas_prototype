import { render } from '@testing-library/react'
import { useEffect } from 'react'
import type { LatLngLiteral, LatLngTuple } from 'leaflet'
import useMapCenterToMarker from './useMapCenterToMarker'
import withAppContext from './withAppContext'
import {
  LAPTOP_L_WIDTH,
  LAPTOP_WIDTH,
  TABLET_M_WIDTH,
} from '../pages/MapPage/components/DrawerPanel/LargeDrawerPanel'

const fitBoundsMock = jest.fn()
const panToMock = jest.fn()

jest.useFakeTimers()

jest.mock('@amsterdam/react-maps', () => ({
  useMapInstance: () => ({
    fitBounds: fitBoundsMock,
    panTo: panToMock,
    latLngToContainerPoint: (latLng: LatLngLiteral) => ({
      x: latLng.lat,
      y: latLng.lng,
    }),
    containerPointToLatLng: (latLng: LatLngTuple) => latLng,
  }),
}))

function mockMatchMedia(width = 400) {
  window.matchMedia = jest.fn().mockImplementation((query) => {
    return {
      matches: !!query.includes(`${width}px`),
      media: () => {},
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }
  })
}

describe('useMapCenterToMarker', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeight as PropertyDescriptor,
    )
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidth as PropertyDescriptor,
    )
  })

  it('should pan to the middle of the map when media matches size < laptop', () => {
    mockMatchMedia(1023)
    const newLat = 1000
    const Component = () => {
      const { panToWithPanelOffset } = useMapCenterToMarker()
      useEffect(() => {
        panToWithPanelOffset({
          lat: newLat, // presume user clicks on the far right edge of the map
          lng: 1000,
        })
      }, [])
      return <div data-testid="drawerPanel" />
    }
    render(withAppContext(<Component />))

    expect(panToMock).toHaveBeenCalledWith([newLat - TABLET_M_WIDTH / 2, 1000])
  })

  it('should pan to the middle of the map when media matches size >= laptop', () => {
    mockMatchMedia(1024)
    const newLat = 1000
    const Component = () => {
      const { panToWithPanelOffset } = useMapCenterToMarker()
      useEffect(() => {
        panToWithPanelOffset({
          lat: newLat, // presume user clicks on the far right edge of the map
          lng: 1000,
        })
      }, [])
      return <div data-testid="drawerPanel" />
    }
    render(withAppContext(<Component />))

    expect(panToMock).toHaveBeenCalledWith([newLat - LAPTOP_WIDTH / 2, 1000])
  })

  it('should pan to the middle of the map when media matches size >= laptopL', () => {
    mockMatchMedia(1430)
    const newLat = 1000
    const Component = () => {
      const { panToWithPanelOffset } = useMapCenterToMarker()
      useEffect(() => {
        panToWithPanelOffset({
          lat: newLat, // presume user clicks on the far right edge of the map
          lng: 1000,
        })
      }, [])
      return <div data-testid="drawerPanel" />
    }
    render(withAppContext(<Component />))

    expect(panToMock).toHaveBeenCalledWith([newLat - LAPTOP_L_WIDTH / 2, 1000])
  })
})
