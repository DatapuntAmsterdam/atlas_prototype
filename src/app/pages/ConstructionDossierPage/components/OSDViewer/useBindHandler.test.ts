import { renderHook } from '@testing-library/react-hooks'
import { Viewer } from 'openseadragon'
import useBindHandler from './useBindHandler'

describe('useBindHandler', () => {
  it('does not throw if the viewer is not present', () => {
    const { result } = renderHook(() => useBindHandler('open', null))
    expect(result.error).toBeUndefined()
  })

  it('does nothing if the handler is not present', () => {
    const mockAddHandler = jest.fn()
    const fakeViewer = {
      addHandler: mockAddHandler,
      removeHandler: () => {},
    } as unknown as Viewer

    const { result } = renderHook(() => useBindHandler('open', fakeViewer))

    expect(mockAddHandler).not.toBeCalled()
    expect(result.error).toBeUndefined()
  })

  it('adds an event handler', () => {
    const handler = () => {}
    const mockAddHandler = jest.fn()
    const fakeViewer = {
      addHandler: mockAddHandler,
      removeHandler: () => {},
    } as unknown as Viewer

    renderHook(() => useBindHandler('open', fakeViewer, handler))
    expect(mockAddHandler).toBeCalledWith('open', handler)
  })

  it('removes an event handler when unmounted', () => {
    const handler = () => {}
    const mockRemoveHandler = jest.fn()
    const fakeViewer = {
      addHandler: () => {},
      removeHandler: mockRemoveHandler,
    } as unknown as Viewer

    const { unmount } = renderHook(() => useBindHandler('open', fakeViewer, handler))
    unmount()

    expect(mockRemoveHandler).toBeCalledWith('open', handler)
  })
})
