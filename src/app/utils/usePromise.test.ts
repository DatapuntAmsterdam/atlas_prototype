import { renderHook } from '@testing-library/react-hooks'
import usePromise, { PromiseStatus } from './usePromise'

describe('usePromise', () => {
  it('returns the pending status while the promise is in-flight', () => {
    const promise = new Promise(() => {})
    const { result } = renderHook(() => usePromise(() => promise))

    expect(result.current).toEqual({
      status: PromiseStatus.Pending,
    })
  })

  it('returns the value when the promise is resolved', async () => {
    const value = 'foo'
    const promise = Promise.resolve(value)
    const { result, waitForNextUpdate } = renderHook(() => usePromise(() => promise))

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Fulfilled,
      value,
    })
  })

  it('returns the error when the promise is rejected', async () => {
    const error = new Error('Whoopsie')
    const promise = Promise.reject(error)
    const { result, waitForNextUpdate } = renderHook(() => usePromise(() => promise))

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Rejected,
      error,
    })
  })

  it('ignores resolved values of preceding promises', async () => {
    const first = createPromiseWithCallbacks()
    const last = createPromiseWithCallbacks()
    let currentPromise = first.promise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      usePromise(() => currentPromise),
    )

    currentPromise = last.promise

    rerender()

    last.resolve('last')
    first.resolve('first')

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Fulfilled,
      value: 'last',
    })
  })

  it('ignores rejected values of preceding promises', async () => {
    const first = createPromiseWithCallbacks()
    const last = createPromiseWithCallbacks()
    let currentPromise = first.promise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      usePromise(() => currentPromise),
    )

    currentPromise = last.promise

    rerender()

    const lastError = new Error('last')

    last.reject(lastError)
    first.reject(new Error('first'))

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Rejected,
      error: lastError,
    })
  })

  it('memoizes the promise based on the dependencies', async () => {
    let currentCount = 0
    let retryCount = 0

    async function nextNumber() {
      // eslint-disable-next-line no-plusplus
      return currentCount++
    }

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      usePromise(() => nextNumber(), [retryCount]),
    )

    rerender()
    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Fulfilled,
      value: 0,
    })

    retryCount = 1
    rerender()
    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Fulfilled,
      value: 1,
    })
  })
})

function createPromiseWithCallbacks() {
  let resolve: (value: any) => void
  let reject: (error: any) => void

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    // @ts-ignore
    resolve,
    // @ts-ignore
    reject,
  }
}
