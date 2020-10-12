import { Alert, Button, Heading, Paragraph } from '@amsterdam/asc-ui'
import React, { ReactElement } from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import styled from 'styled-components'
import usePromise, { PromiseFulfilledResult, PromiseStatus } from '../../utils/usePromise'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import NotificationLevel from '../../models/notification'
import { AuthError } from '../../../shared/services/api/errors'
import { login } from '../../../shared/services/auth/auth'
import useDocumentTitle from '../../utils/useDocumentTitle'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

export interface PageTemplateProps<T> {
  promise: Promise<any>
  onRetry?: () => void
  errorMessage?: string
  children: ({ result }: { result: PromiseFulfilledResult<T> }) => ReactElement
}

const onReload = () => {
  window.location.reload()
}

const PromiseResult: <T>(p: PageTemplateProps<T>) => React.ReactElement<PageTemplateProps<T>> = ({
  promise,
  onRetry,
  errorMessage,
  children,
}) => {
  const result = usePromise(promise)
  const { trackEvent } = useMatomo()
  const { documentTitle } = useDocumentTitle()

  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    if (result.error instanceof AuthError && result.error.code === 401) {
      return (
        <Alert level={NotificationLevel.Attention} dismissible>
          <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>
          <Paragraph>{result.error.message}</Paragraph>
          <Button
            variant="textButton"
            onClick={() => {
              trackEvent({ category: 'login', name: documentTitle, action: 'inloggen' })
              login()
            }}
          >
            Inloggen
          </Button>
        </Alert>
      )
    }
    return (
      <ErrorMessage
        message={errorMessage || 'Er is een fout opgetreden bij het laden van dit blok'}
        buttonLabel="Probeer opnieuw"
        buttonOnClick={onRetry || onReload}
      />
    )
  }

  return children({ result })
}

export default PromiseResult
