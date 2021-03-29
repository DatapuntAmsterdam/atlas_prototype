import usePromise, { isFulfilled, isPending, PromiseFactoryFn } from '@amsterdam/use-promise'
import { DependencyList, ReactElement, useState } from 'react'
import styled from 'styled-components'
import { AuthError } from '../../../shared/services/api/customError'
import AuthAlert from '../Alerts/AuthAlert'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 50%;
`

export interface PromiseResultProps<T> {
  factory: PromiseFactoryFn<T>
  deps?: DependencyList
  errorMessage?: string
  onError?: (e: Error) => void
  children: (result: PromiseFulfilledResult<T>) => ReactElement | null
}

const PromiseResult: <T>(props: PromiseResultProps<T>) => ReactElement | null = ({
  factory,
  deps = [],
  errorMessage,
  onError,
  children,
}) => {
  const [retryCount, setRetryCount] = useState(0)
  const result = usePromise(factory, [...deps, retryCount])

  if (isFulfilled(result)) {
    return children(result)
  }

  if (isPending(result)) {
    return <StyledLoadingSpinner />
  }

  if (result.reason instanceof AuthError) {
    return <AuthAlert data-testid="auth-alert" excludedResults={result.reason.message} />
  }

  if (onError) {
    onError(result.reason)
  }

  return (
    <ErrorMessage
      data-testid="error-message"
      message={errorMessage ?? 'Er is een fout opgetreden bij het laden van dit blok'}
      buttonLabel="Probeer opnieuw"
      buttonOnClick={() => setRetryCount(retryCount + 1)}
    />
  )
}

export default PromiseResult
