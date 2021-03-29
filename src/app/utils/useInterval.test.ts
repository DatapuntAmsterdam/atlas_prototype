import { renderHook } from '@testing-library/react-hooks'
import useInterval from './useInterval'

describe('useInterval', () => {
  it('schedules an interval with the provided delay', () => {
    const setIntervalMock = jest.spyOn(global, 'setInterval')

    renderHook(() => useInterval(() => {}, 1000))
    expect(setIntervalMock).toHaveBeenCalledWith(expect.anything(), 1000)

    setIntervalMock.mockRestore()
  })

  it('clears the scheduled interval if the provided delay changes', () => {
    const setIntervalMock = jest.spyOn(global, 'setInterval').mockReturnValue(123)
    const clearIntervalMock = jest.spyOn(global, 'clearInterval')
    let delay = 1000

    const { rerender } = renderHook(() => useInterval(() => {}, delay))
    delay = 500
    rerender()

    expect(clearIntervalMock).toHaveBeenCalledWith(123)

    setIntervalMock.mockRestore()
    clearIntervalMock.mockRestore()
  })

  it('calls the callback after the provided delay elapses', () => {
    jest.useFakeTimers()
    const callback = jest.fn()

    renderHook(() => useInterval(callback, 1000))
    jest.advanceTimersByTime(1000)

    expect(callback).toHaveBeenCalled()
  })

  it('updates the callback to the latest value', () => {
    jest.useFakeTimers()
    let callback = jest.fn()
    const newCallback = jest.fn()

    const { rerender } = renderHook(() => useInterval(callback, 1000))
    callback = newCallback
    rerender()
    jest.advanceTimersByTime(1000)

    expect(newCallback).toHaveBeenCalled()
  })
})
