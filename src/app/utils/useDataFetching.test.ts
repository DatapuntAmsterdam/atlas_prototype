import { act, renderHook } from '@testing-library/react-hooks'
import useDataFetching from './useDataFetching'

jest.mock('../../shared/services/api/api', () => ({
  fetchWithToken: () => Promise.resolve({}),
}))

jest.useFakeTimers()

describe('useDataFetching', () => {
  it('should have a fetchData function', () => {
    const { result } = renderHook(() => useDataFetching())
    expect(result.current.fetchData).toBeInstanceOf(Function)
  })

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useDataFetching())
    expect(result.current.loading).toBe(false)
    expect(result.current.errorMessage).toBe(false)
    expect(result.current.results).toBe(null)
  })

  it('should set the loading state when fetchData is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDataFetching())
    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.fetchData('test')
    })

    expect(result.current.loading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.loading).toBe(false)
  })
})
