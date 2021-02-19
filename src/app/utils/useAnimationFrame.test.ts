import { renderHook } from '@testing-library/react-hooks'
import useAnimationFrame from './useAnimationFrame'

jest.useFakeTimers()

describe('useAnimationFrame', () => {
  const MOCK_TIME = 16
  let rafSpy: jest.SpyInstance

  beforeEach(() => {
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => setTimeout(() => cb(MOCK_TIME)))
  })

  afterEach(() => {
    rafSpy.mockRestore()
  })

  it('requests an animation frame', () => {
    const { result } = renderHook(() => useAnimationFrame())
    const callback = jest.fn()

    result.current(callback)

    jest.runAllTimers()

    expect(callback).toBeCalledWith(MOCK_TIME)
  })

  it('requests an animation frame only with the latest callback', () => {
    const { result } = renderHook(() => useAnimationFrame())
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    result.current(callback1)
    result.current(callback2)

    jest.runAllTimers()

    expect(callback1).not.toBeCalled()
    expect(callback2).toBeCalledWith(MOCK_TIME)
  })

  it('only requests a single animation frame when calling multiple times', () => {
    const { result } = renderHook(() => useAnimationFrame())
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    result.current(callback1)
    result.current(callback2)

    jest.runAllTimers()

    expect(rafSpy).toBeCalledTimes(1)
  })
})
