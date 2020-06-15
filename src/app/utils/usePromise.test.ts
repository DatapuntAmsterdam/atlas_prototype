import { renderHook } from '@testing-library/react-hooks'
import usePromise, { PromiseStatus } from './usePromise'

describe('usePromise', () => {
  it('should return the pending status while the promise is in-flight', () => {
    const promise = new Promise(() => {})
    const { result } = renderHook(() => usePromise(promise))

    expect(result.current).toEqual({
      status: PromiseStatus.Pending,
    })
  })

  it('should return the value when the promise is resolved', async () => {
    const value = 'foo'
    const promise = Promise.resolve(value)
    const { result, waitForNextUpdate } = renderHook(() => usePromise(promise))

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Fulfilled,
      value,
    })
  })

  it('should return the error when the promise is rejected', async () => {
    const error = new Error('Whoopsie')
    const promise = Promise.reject(error)
    const { result, waitForNextUpdate } = renderHook(() => usePromise(promise))

    await waitForNextUpdate()

    expect(result.current).toEqual({
      status: PromiseStatus.Rejected,
      error,
    })
  })

  it('should ignore resolved values of preceding promises', async () => {
    const first = createPromiseWithCallbacks()
    const last = createPromiseWithCallbacks()
    let currentPromise = first.promise

    const { result, rerender, waitForNextUpdate } = renderHook(() => usePromise(currentPromise))

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

  it('should ignore rejected values of preceding promises', async () => {
    const first = createPromiseWithCallbacks()
    const last = createPromiseWithCallbacks()
    let currentPromise = first.promise

    const { result, rerender, waitForNextUpdate } = renderHook(() => usePromise(currentPromise))

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
    resolve,
    reject,
  }
}
