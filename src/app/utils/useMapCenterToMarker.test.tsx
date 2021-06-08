import { render } from '@testing-library/react'
import { useEffect } from 'react'
import type { LatLngLiteral, LatLngTuple } from 'leaflet'
import useMapCenterToMarker from './useMapCenterToMarker'

const fitBoundsMock = jest.fn()
const panToMock = jest.fn()

const WINDOW_INNERWIDTH = 1500
const DRAWER_WIDTH = 500

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: WINDOW_INNERWIDTH,
})

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

describe('useMapCenterToMarker', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: DRAWER_WIDTH,
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: DRAWER_WIDTH,
    })
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

  it('should pan to the middle of the map', () => {
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
    render(<Component />)
    jest.runAllTimers()

    expect(panToMock).toHaveBeenCalledWith([newLat - DRAWER_WIDTH / 2, 1000])
  })
})
