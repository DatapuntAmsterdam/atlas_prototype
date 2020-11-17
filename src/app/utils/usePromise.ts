import { DependencyList, useEffect, useMemo, useState } from 'react'

export enum PromiseStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

export type PromiseResult<T> =
  | PromisePendingResult
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult

export interface PromisePendingResult {
  status: PromiseStatus.Pending
}

export interface PromiseFulfilledResult<T> {
  status: PromiseStatus.Fulfilled
  value: T
}

export interface PromiseRejectedResult {
  status: PromiseStatus.Rejected
  error: any
}

export type PromiseFactoryFn<T> = () => Promise<T>

/**
 * Takes a function that creates a promise and returns it's resolved or rejected value together with the status of the promise.
 * When passing in a promise make sure that the dependencies are passed as well:
 *
 * ```ts
 * const result = usePromise(() => fetchUser(userId), [userId])
 * ```
 *
 * @param factory The function that creates the promise that will be used.
 * @param deps The dependencies of the factory function.
 */
export default function usePromise<T = any>(factory: PromiseFactoryFn<T>, deps?: DependencyList) {
  const promise = useMemo(factory, deps)
  const [result, setResult] = useState<PromiseResult<T>>({
    status: PromiseStatus.Pending,
  })

  useEffect(() => {
    if (result.status !== PromiseStatus.Pending) {
      setResult({ status: PromiseStatus.Pending })
    }

    let ignoreResult = false

    promise
      .then((value) => !ignoreResult && setResult({ status: PromiseStatus.Fulfilled, value }))
      .catch((error) => !ignoreResult && setResult({ status: PromiseStatus.Rejected, error }))

    return () => {
      ignoreResult = true
    }
  }, [promise])

  return result
}
