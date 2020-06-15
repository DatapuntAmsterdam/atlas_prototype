import { useEffect, useState } from 'react'

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

/**
 * Takes a promise and returns it's resolved or rejected value. While the promise is in flight an intermediate value is returned which can be used for loading states.
 *
 * When passing in a promise make sure that the instance is cached using `useMemo`, for example:
 *
 * ```ts
 * const result = usePromise(
 *   useMemo(() => fetchUser(userId), [userId]),
 * )
 * ```
 *
 * @param promise The promise of which the value will be retrieved.
 */
export default function usePromise<T = any>(promise: Promise<T>) {
  const [result, setResult] = useState<PromiseResult<T>>({
    status: PromiseStatus.Pending,
  })

  useEffect(() => {
    setResult({ status: PromiseStatus.Pending })

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
