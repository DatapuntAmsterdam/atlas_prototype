import { fireEvent, render } from '@testing-library/react'
import MapPanel from './MapPanel'
import withMapContext from '../../../../utils/withMapContext'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: jest.fn(() => ({
    height: 0,
    width: 0,
  })),
}))

const mockPush = jest.fn()
let currentPath = '/kaart/bag/foo/bar' // detail page
let search = '?locatie=123,123'
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search,
  }),
}))

describe('MapPanel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should open and close the legend panel', () => {
    const { getByTestId, queryByTestId } = render(withMapContext(<MapPanel loading={false} />))

    const legendControlButton = getByTestId('legendControl').querySelector('button')

    expect(queryByTestId('legendPanel')).toBeNull()

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(getByTestId('legendPanel')).toBeDefined()

    // Close
    const closeButton = getByTestId('closePanelButton')
    fireEvent.click(closeButton)
    expect(queryByTestId('legendPanel')).toBeNull()
  })

  it('should show the right map controls when panorama is not in full screen mode', () => {
    const { queryByTestId } = render(withMapContext(<MapPanel loading={false} />))

    expect(queryByTestId('baselayerControl')).toBeDefined()
    expect(queryByTestId('drawtoolControl')).toBeDefined()
    expect(queryByTestId('legendControl')).toBeDefined()
  })

  it('should show the right map controls when panorama is in full screen mode', () => {
    const { queryByTestId } = render(
      withMapContext(<MapPanel loading={false} />, { panoFullScreen: true }),
    )

    expect(queryByTestId('drawtoolControl')).toBeNull()
    expect(queryByTestId('baselayerControl')).toBeNull()
    expect(queryByTestId('legendControl')).toBeDefined()
  })

  it('should navigate to geosearch page when closing detail panel', () => {
    const { getByTestId } = render(withMapContext(<MapPanel loading={false} />))

    const closeButton = getByTestId('closePanelButton')
    fireEvent.click(closeButton)

    expect(mockPush).toBeCalledWith({ pathname: '/kaart/geozoek/', search: 'locatie=123%2C123' })
  })

  it('should remove the location parameter when closing geosearch panel', () => {
    currentPath = '/kaart/geozoek/'

    const { getByTestId, queryByTestId } = render(withMapContext(<MapPanel loading={false} />))

    expect(queryByTestId('drawerPanel')).toBeDefined()

    const closeButton = getByTestId('closePanelButton')
    fireEvent.click(closeButton)

    expect(mockPush).toBeCalledWith({ pathname: '/kaart/geozoek/', search: '' })
  })

  it("should not show the panel when location isn't set on geosearch page", () => {
    currentPath = '/kaart/geozoek/'
    search = ''

    const { queryByTestId } = render(withMapContext(<MapPanel loading={false} />))

    expect(queryByTestId('drawerPanel')).toBeNull()
  })

  it('should show the panel when location is set on geosearch page', () => {
    currentPath = '/kaart/geozoek/'
    search = '?locatie=123,123'

    const { queryByTestId } = render(withMapContext(<MapPanel loading={false} />))

    expect(queryByTestId('drawerPanel')).not.toBeNull()
  })

  it("should not show the panel when polygon isn't set on dataselection pages (adressen, vestigingen and kadastrale objecten)", () => {
    currentPath = '/kaart/bag/adressen/'
    search = ''

    const { queryByTestId, rerender } = render(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).toBeNull()

    currentPath = '/kaart/hr/vestigingen/'
    rerender(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).toBeNull()

    currentPath = '/kaart/brk/kadastrale-objecten/'
    rerender(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).toBeNull()
  })

  it('should show the panel when polygon is set on dataselection pages (adressen, vestigingen and kadastrale objecten)', () => {
    currentPath = '/kaart/bag/adressen/'
    search = `?geo=${JSON.stringify({
      id: 123,
      polygon: [
        [123, 123],
        [321, 321],
      ],
    })}`

    const { queryByTestId, rerender } = render(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).not.toBeNull()

    currentPath = '/kaart/hr/vestigingen/'
    rerender(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).not.toBeNull()

    currentPath = '/kaart/brk/kadastrale-objecten/'
    rerender(withMapContext(<MapPanel loading={false} />))
    expect(queryByTestId('drawerPanel')).not.toBeNull()
  })
})
