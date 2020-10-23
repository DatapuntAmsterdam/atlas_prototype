import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { AuthError } from '../../../shared/services/api/errors'
import usePromise, { PromiseFulfilledResult, PromiseStatus } from '../../utils/usePromise'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import AuthAlert from '../Alerts/AuthAlert'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 50%;
`

export interface PageTemplateProps<T> {
  promise: Promise<T>
  onRetry?: () => void
  errorMessage?: string
  children: (result: PromiseFulfilledResult<T>) => ReactElement | null
}

const onReload = () => {
  window.location.reload()
}

const PromiseResult: <T>(props: PageTemplateProps<T>) => ReactElement | null = ({
  promise,
  onRetry,
  errorMessage,
  children,
}) => {
  const result = usePromise(promise)

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
      buttonOnClick={onRetry ?? onReload}
    />
  )
}

export default PromiseResult
