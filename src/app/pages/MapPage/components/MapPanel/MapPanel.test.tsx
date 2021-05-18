import { screen, fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import MapPanel from './MapPanel'
import 'jest-styled-components'
import withMapContext from '../../../../utils/withMapContext'
import { DataSelectionProvider } from '../../../../components/DataSelection/DataSelectionContext'
import type { MapContextProps } from '../../MapContext'
import { UiProvider } from '../../../../contexts/ui'

jest.mock('../DrawTool/DrawTool', () => () => null)

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

const renderWithWrapper = (component: ReactNode, mapContextProps?: Partial<MapContextProps>) =>
  withMapContext(
    <DataSelectionProvider>
      <UiProvider>{component}</UiProvider>
    </DataSelectionProvider>,
    mapContextProps,
  )

describe('MapPanel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should open and close the legend panel', () => {
    render(renderWithWrapper(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    const closeButton = screen.getByTestId('closePanelButton')
    fireEvent.click(closeButton)
    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should hide (not unmount) the content panel when legend panel is active', () => {
    currentPath = '/kaart/geozoek/'
    search = '?locatie=123,123'
    render(renderWithWrapper(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    expect(screen.getByTestId('drawerPanel')).toHaveStyleRule('display', 'block')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.queryAllByTestId('drawerPanel')[0]).toHaveStyleRule('display', 'none')
  })

  it('should close the legend panel when navigating to a detail panel', () => {
    const { rerender } = render(renderWithWrapper(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    currentPath = '/kaart/parkeervakken/parkeervakken/120876487667/'
    rerender(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should close the legend panel when navigating to a geo search', () => {
    const { rerender } = render(renderWithWrapper(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    currentPath = '/kaart/geozoek/'
    rerender(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should show the right map controls when panorama is not in full screen mode', () => {
    render(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('mapContextMenuControls')).toBeInTheDocument()
    expect(screen.queryByTestId('drawtoolControl')).toBeInTheDocument()
    expect(screen.queryByTestId('legendControl')).toBeInTheDocument()
  })

  it('should show the right map controls when panorama is in full screen mode', () => {
    render(renderWithWrapper(<MapPanel />, { panoFullScreen: true }))

    expect(screen.queryByTestId('drawtoolControl')).not.toBeInTheDocument()
    expect(screen.queryByTestId('baselayerControl')).not.toBeInTheDocument()
    expect(screen.queryByTestId('legendControl')).toBeInTheDocument()
  })

  it("should not render the panel when location isn't set on geosearch page", () => {
    currentPath = '/kaart/geozoek/'
    search = ''

    render(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()
  })

  it('should show the panel when location is set on geosearch page', () => {
    currentPath = '/kaart/geozoek/'
    search = '?locatie=123,123'

    render(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()
  })
})
