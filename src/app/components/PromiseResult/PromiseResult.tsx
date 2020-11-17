import React, { DependencyList, ReactElement, useState } from 'react'
import styled from 'styled-components'
import { AuthError } from '../../../shared/services/api/errors'
import usePromise, {
  PromiseFactoryFn,
  PromiseFulfilledResult,
  PromiseStatus,
} from '../../utils/usePromise'
import AuthAlert from '../Alerts/AuthAlert'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 50%;
`

export interface PageTemplateProps<T> {
  factory: PromiseFactoryFn<T>
  deps?: DependencyList
  errorMessage?: string
  children: (result: PromiseFulfilledResult<T>) => ReactElement | null
}

const PromiseResult: <T>(props: PageTemplateProps<T>) => ReactElement | null = ({
  factory,
  deps,
  errorMessage,
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

  if (result.error instanceof AuthError && result.error.code === 401) {
    return <AuthAlert excludedResults={result.error.message} />
  }

  return (
    <ErrorMessage
      message={errorMessage ?? 'Er is een fout opgetreden bij het laden van dit blok'}
      buttonLabel="Probeer opnieuw"
      buttonOnClick={() => setRetryCount(retryCount + 1)}
    />
  )
}

export default PromiseResult
