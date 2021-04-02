import { Button, Paragraph } from '@amsterdam/asc-ui'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import requestLoginLink from '../../../../../api/iiif/requestLoginLink'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import ButtonBar from './ButtonBar'

const LoadingText = styled(Paragraph)`
  text-align: center;
`

export interface LoginLinkRequestFlowProps {
  email: string
  onRetry: () => void
  onClose: () => void
}

const LoginLinkRequestFlow: FunctionComponent<LoginLinkRequestFlowProps> = ({
  email,
  onRetry,
  onClose,
}) => {
  const result = usePromise(() => requestLoginLink({ email, originUrl: window.location.href }), [
    email,
  ])

  if (isPending(result)) {
    return (
      <>
        <LoadingText data-testid="loadingMessage">
          Bezig met aanvragen toegangslink&hellip;
        </LoadingText>
        <LoadingSpinner />
      </>
    )
  }

  if (isRejected(result)) {
    return (
      <>
        <Paragraph data-testid="errorMessage">
          Er is helaas iets mis gegaan met het versturen van uw e-mailadres. Probeer het nog eens.
        </Paragraph>
        <ButtonBar>
          <Button type="button" variant="primary" onClick={onRetry}>
            Probeer opnieuw
          </Button>
          <Button type="button" onClick={onClose}>
            Annuleren
          </Button>
        </ButtonBar>
      </>
    )
  }

  return (
    <>
      <Paragraph data-testid="successMessage">
        Bedankt voor uw aanvraag. U onvangt een e-mail op het adres {email} met uw toegangslink.
        Controleer mogelijk ook uw spambox.
      </Paragraph>
      <Button type="button" variant="primary" onClick={onClose}>
        Sluiten
      </Button>
    </>
  )
}

export default LoginLinkRequestFlow
