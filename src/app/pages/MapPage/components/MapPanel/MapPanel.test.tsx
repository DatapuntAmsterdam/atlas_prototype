import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import MapPanel from './MapPanel'
import 'jest-styled-components'
import withMapContext from '../../../../utils/withMapContext'
import { DataSelectionProvider } from '../../../../components/DataSelection/DataSelectionContext'
import type { MapContextProps } from '../../MapContext'
import { UiProvider } from '../../../../contexts/ui'
import { DrawerState } from '../DrawerOverlay'

jest.mock('../DrawTool/DrawTool', () => () => null)

jest.mock('react-resize-detector', () => ({
  useResizeDetector: jest.fn(() => ({
    height: 0,
    width: 0,
  })),
}))

const mockPush = jest.fn()
let currentPath = '/data/bag/foo/bar' // detail page
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
    const setLegendActiveMock = jest.fn()
    const setDrawerStateMock = jest.fn()
    const { rerender } = render(
      renderWithWrapper(<MapPanel />, {
        setDrawerState: setDrawerStateMock,
        setLegendActive: setLegendActiveMock,
      }),
    )

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Hide the legend and open the drawer by default onload (since we are on a detail page)
    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)
    expect(setLegendActiveMock).toHaveBeenCalledWith(false)

    // Open
    rerender(
      renderWithWrapper(<MapPanel />, {
        setDrawerState: setDrawerStateMock,
        setLegendActive: setLegendActiveMock,
        legendActive: true,
      }),
    )
    fireEvent.click(legendControlButton as Element)
    expect(setLegendActiveMock).toHaveBeenCalledWith(true)

    // Close
    const closeButton = screen.getByTestId('closePanelButton')
    fireEvent.click(closeButton)
    expect(setLegendActiveMock).toHaveBeenCalledWith(false)
  })

  it('should hide (not unmount) the content panel when legend panel is active', () => {
    currentPath = '/data/geozoek/'
    search = '?locatie=123,123'
    const { rerender } = render(
      renderWithWrapper(<MapPanel />, { drawerState: DrawerState.Open, legendActive: false }),
    )

    expect(screen.getByTestId('drawerPanel')).toHaveStyleRule('display', 'block')

    rerender(
      renderWithWrapper(<MapPanel />, { drawerState: DrawerState.Closed, legendActive: true }),
    )
    expect(screen.queryAllByTestId('drawerPanel')[0]).toHaveStyleRule('display', 'none')
  })

  it('should close the legend panel when navigating to a detail panel', () => {
    const setDrawerStateMock = jest.fn()
    const { rerender } = render(
      renderWithWrapper(<MapPanel />, { setDrawerState: setDrawerStateMock }),
    )

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)

    // Close
    currentPath = '/data/parkeervakken/parkeervakken/120876487667/'
    rerender(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should close the legend panel when navigating to a geo search without params', () => {
    const setDrawerStateMock = jest.fn()
    const { rerender } = render(
      renderWithWrapper(<MapPanel />, { setDrawerState: setDrawerStateMock }),
    )

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)

    // Close
    currentPath = '/data/geozoek/'
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
    currentPath = '/data/geozoek/'
    search = ''

    render(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()
  })

  it('should show the panel when location is set on geosearch page', () => {
    currentPath = '/data/geozoek/'
    search = '?locatie=123,123'

    render(renderWithWrapper(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()
  })
})
