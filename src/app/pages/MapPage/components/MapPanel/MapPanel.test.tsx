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

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search: '?locatie=123,123',
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
})
