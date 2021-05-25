import { Alert, Paragraph } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { getMessage } from '../../../shared/ducks/error/error-message'

const StyledAlert = styled(Alert)`
  /* Ensure outline is visible when element is in focus */
  &:focus {
    z-index: 999;
  }

  @media print {
    display: none;
  }
`

const ErrorAlert: FunctionComponent = () => {
  const message = useSelector(getMessage)

  return (
    <StyledAlert dismissible level="error">
      <Paragraph>{message}</Paragraph>
    </StyledAlert>
  )
}

export default ErrorAlert
