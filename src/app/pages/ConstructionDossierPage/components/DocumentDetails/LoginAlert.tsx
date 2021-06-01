import { Alert, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useAuthToken } from '../../AuthTokenContext'
import LinkButton from '../LinkButton'
import LoginLinkButton from '../LoginLinkButton'

export interface LoginAlertProps {
  restricted: boolean
  onRequestLoginLink: () => void
}

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)} !important;
`

const LoginAlert: FunctionComponent<LoginAlertProps> = ({ restricted, onRequestLoginLink }) => {
  const { isTokenExpired } = useAuthToken()

  if (isTokenExpired) {
    return (
      <StyledAlert level="info" dismissible data-testid="noValidToken">
        <div>
          De toegangslink die u gebruikt is verlopen. U kunt hier opnieuw{' '}
          <LinkButton type="button" onClick={onRequestLoginLink}>
            toegang aanvragen
          </LinkButton>{' '}
          om de bouw- en omgevingsdossiers in te zien. Medewerkers/ketenpartners van de Gemeente
          Amsterdam kunnen <LoginLinkButton>inloggen</LoginLinkButton> om deze te bekijken.
        </div>
      </StyledAlert>
    )
  }

  if (restricted) {
    return (
      <StyledAlert level="info" dismissible data-testid="noExtendedRights">
        <div>
          Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen{' '}
          <LoginLinkButton>inloggen</LoginLinkButton> om alle bouw- en omgevingsdossiers te
          bekijken.
        </div>
      </StyledAlert>
    )
  }

  return (
    <StyledAlert level="info" dismissible data-testid="noRights">
      <div>
        U kunt hier{' '}
        <LinkButton type="button" onClick={onRequestLoginLink}>
          toegang aanvragen
        </LinkButton>{' '}
        om de om bouw- en omgevingsdossiers in te zien. Medewerkers/ketenpartners van Gemeente
        Amsterdam kunnen <LoginLinkButton>inloggen</LoginLinkButton> om deze te bekijken.
      </div>
    </StyledAlert>
  )
}

export default LoginAlert
