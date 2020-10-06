import { Container } from '@amsterdam/asc-ui'
import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { PromiseResult, PromiseStatus } from '../../utils/usePromise'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

export interface PageTemplateProps {
  result: PromiseResult<any>
  onRetry: () => void
  errorMessage?: string
}

const PageTemplate: FunctionComponent<PageTemplateProps> = ({
  result,
  onRetry,
  errorMessage,
  children,
}) => {
  const component: ReactNode = (() => {
    if (result.status === PromiseStatus.Pending) {
      return <StyledLoadingSpinner />
    }

    if (result.status === PromiseStatus.Rejected) {
      return (
        <ErrorMessage
          message={errorMessage || 'Er is een fout opgetreden bij het laden van deze pagina'}
          buttonLabel="Probeer opnieuw"
          buttonOnClick={onRetry}
        />
      )
    }

    return children
  })()

  return <Container>{component}</Container>
}

export default PageTemplate
