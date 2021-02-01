import { DependencyList, ReactElement, useState } from 'react'
import styled from 'styled-components'
import usePromise, {
  PromiseFactoryFn,
  PromiseFulfilledResult,
  PromiseStatus,
} from '../../utils/usePromise'
import AuthAlert from '../Alerts/AuthAlert'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { AuthError } from '../../../shared/services/api/customError'

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

  if (result.status === PromiseStatus.Fulfilled) {
    return children(result)
  }

  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.error instanceof AuthError) {
    return <AuthAlert data-testid="auth-alert" excludedResults={result.error.message} />
  }

  if (onError) {
    onError(result.error)
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
