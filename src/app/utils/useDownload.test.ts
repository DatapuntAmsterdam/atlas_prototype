import * as fileSaver from 'file-saver'
import { act, renderHook } from '@testing-library/react-hooks'
import useDownload from './useDownload'

jest.useFakeTimers()

jest.mock('file-saver')

describe('useDownload', () => {
  it('should have correct initial values', () => {
    const { result } = renderHook(() => useDownload())

    expect(result.current[0]).toBe(false)
    expect(result.current[1]).toBeInstanceOf(Function)
  })

  it('should call fileSaver with right arguments', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => 'blob',
      }),
    )

    // @ts-ignore
    const mockFileSaver = jest.spyOn(fileSaver, 'default')
    const { result, waitForNextUpdate } = renderHook(() => useDownload())

    const loading = result.current[0]
    const downloadFn = result.current[1]
    act(() => {
      downloadFn('url', {}, 'filename.ext')
    })
    await waitForNextUpdate()
    expect(mockFileSaver).toHaveBeenCalledWith('blob', 'filename.ext')
    jest.runAllTimers()
    expect(loading).toBe(false)
  })
})
