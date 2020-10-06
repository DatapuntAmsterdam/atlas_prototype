import React from 'react'
import styled from 'styled-components'
import { Container } from '@amsterdam/asc-ui'
import { PromiseResult, PromiseStatus } from '../../utils/usePromise'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

type Props = {
  result: PromiseResult<any>
  onRetry: () => void
  errorMessage?: string
}

const PageTemplate: React.FC<Props> = ({ result, onRetry, errorMessage, children }) => {
  let component
  if (result.status === PromiseStatus.Pending) {
    component = <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    component = (
      <ErrorMessage
        message={errorMessage || 'Er is een fout opgetreden bij het laden van deze pagina'}
        buttonLabel="Probeer opnieuw"
        buttonOnClick={onRetry}
      />
    )
  }

  if (result.status === PromiseStatus.Fulfilled) {
    component = children
  }

  return <Container>{component}</Container>
}

export default PageTemplate
