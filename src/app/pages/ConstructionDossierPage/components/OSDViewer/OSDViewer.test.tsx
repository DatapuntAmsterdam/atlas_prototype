import { screen, render } from '@testing-library/react'
import { Viewer } from 'openseadragon'
import { mocked } from 'ts-jest/utils'
import OSDViewer from './OSDViewer'
import useBindHandler from './useBindHandler'

jest.mock('openseadragon')
jest.mock('./useBindHandler')

const mockedViewer = mocked(Viewer)
const mockedUseBindHandler = mocked(useBindHandler)

describe('OSDViewer', () => {
  beforeEach(() => {
    mockedViewer.mockReturnValue(({
      addHandler: jest.fn(),
      removeHandler: jest.fn(),
      destroy: jest.fn(),
    } as unknown) as Viewer)

    mockedUseBindHandler.mockImplementation(() => {})
  })

  afterEach(() => {
    mockedViewer.mockReset()
    mockedUseBindHandler.mockReset()
  })

  it('renders the viewer', () => {
    const { container } = render(<OSDViewer options={{}} />)
    expect(container.firstChild).toBeDefined()
  })

  it('initializes the viewer with the options', () => {
    const { container } = render(<OSDViewer options={{ autoResize: true }} />)

    expect(mockedViewer).toHaveBeenCalledWith({
      element: container.firstChild,
      autoResize: true,
    })
  })

  it('calls the onInit prop when initializing the viewer', () => {
    const mockInstance = ({
      addHandler: jest.fn(),
      removeHandler: jest.fn(),
      destroy: jest.fn(),
    } as unknown) as Viewer

    mockedViewer.mockReturnValue(mockInstance)

    const onInit = jest.fn()

    render(<OSDViewer options={{}} onInit={onInit} />)
    expect(onInit).toHaveBeenCalledWith(mockInstance)
  })

  it('destroys the viewer when unmounted', () => {
    const destroy = jest.fn()

    mockedViewer.mockReturnValue(({
      addHandler: jest.fn(),
      removeHandler: jest.fn(),
      destroy,
    } as unknown) as Viewer)

    const { unmount } = render(<OSDViewer options={{}} />)

    unmount()
    expect(destroy).toHaveBeenCalled()
  })

  it('binds the event handlers', () => {
    const mockInstance = ({
      addHandler: jest.fn(),
      removeHandler: jest.fn(),
      destroy: jest.fn(),
    } as unknown) as Viewer

    mockedViewer.mockReturnValue(mockInstance)

    const onOpen = jest.fn()
    const onOpenFailed = jest.fn()

    render(<OSDViewer options={{}} onOpen={onOpen} onOpenFailed={onOpenFailed} />)

    expect(mockedUseBindHandler).toHaveBeenCalledWith('open', mockInstance, onOpen)
    expect(mockedUseBindHandler).toHaveBeenCalledWith('open-failed', mockInstance, onOpenFailed)
  })

  it('passes along additional props to the root element', () => {
    render(<OSDViewer options={{}} data-testid="viewer" />)
    expect(screen.getByTestId('viewer')).toBeInTheDocument()
  })
})
