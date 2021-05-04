import { useEffect } from 'react'
import { useMapInstance } from '@amsterdam/react-maps'
import L from 'leaflet'
import { render } from '@testing-library/react'
import withMapContext from '../../../../utils/withMapContext'
import DrawTool from './DrawTool'
import { DataSelectionProvider } from '../../../../components/DataSelection/DataSelectionContext'

jest.mock('leaflet', () => ({
  // @ts-ignore
  ...jest.requireActual('leaflet'),
  ...jest.requireActual('leaflet-draw'),
  FeatureGroup: jest.fn().mockImplementation(() => ({
    ...jest.requireActual('leaflet').FeatureGroup,
    _layerAdd: jest.fn(),
    getLayers: jest.fn(() => []),
    eachLayer: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    onRemove: jest.fn(),
    fire: jest.fn(),
    clearLayers: jest.fn(),
  })),
}))

const mockPush = jest.fn()
const mockReplace = jest.fn()
const locationPath = '/kaart/bag/adressen'
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useLocation: () => ({
    search:
      '?geo=%7B"id"%3A"f0f5c03c-9e0c-41f3-aa7f-4a3e397c9ec3"%2C"polygon"%3A%5B%5B52.37652423006439%2C4.895735627162203%5D%2C%5B52.37570331263231%2C4.89496825080288%5D%2C%5B52.37558921037086%2C4.896617972041956%5D%5D%7D&drawToolOpen=true',
    pathname: locationPath,
  }),
}))

describe('DrawTool', () => {
  it('updates the URl query when user edited the polygon', () => {
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent(L.Draw.Event.EDITVERTEX as any, {
          poly: { id: 'foo', getLatLngs: () => [['123'], ['123']] },
        })
      }, [])
      return <DrawTool />
    }

    render(
      withMapContext(
        <DataSelectionProvider>
          <Component />
        </DataSelectionProvider>,
      ),
    )

    // Todo: update to toHaveBeenCalledWith
    expect(mockPush).toHaveBeenCalled()
  })
  it('removes the dataselection and URL parameter when removing a polygon drawing', () => {})
  it('removes the dataselection and URL parameters from all drawings when closing the draw tool', () => {})
  it('removes the previous drawing when ending another drawing of the same type', () => {})
  it('adds existing drawings from URL parameters on initial load', () => {})
  it('shows the previous drawings when browser navigates back', () => {})
  it('shows the next drawings when browser navigates forwards', () => {})
})
