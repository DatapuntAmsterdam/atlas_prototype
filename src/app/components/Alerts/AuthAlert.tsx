import { Alert, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import LoginLink from '../Links/LoginLink/LoginLink'

export interface AuthAlertProps {
  excludedResults?: string
  hideHeader?: boolean
  specialAuthLevel?: boolean
}

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(2)};

  @media print {
    display: none;
  }
`

export const getNormalAuthAlertDescription = (excludedResults?: string) =>
  `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden${
    excludedResults ? ` over: ${excludedResults}` : ''
  }. `

export const getSpecialAuthAlertDescription = (excludedResults?: string) =>
  `Medewerkers met speciale bevoegdheden kunnen alle gegevens zien${
    excludedResults ? ` (ook ${excludedResults})` : ''
  }.`

const AuthAlert: FunctionComponent<AuthAlertProps> = ({
  specialAuthLevel = false,
  excludedResults = '',
  hideHeader,
  ...otherProps
}) => (
  <StyledAlert level="info" dismissible {...otherProps} data-testid="auth-alert">
    {!hideHeader && <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>}
    <Paragraph>
      {specialAuthLevel
        ? getSpecialAuthAlertDescription(excludedResults)
        : getNormalAuthAlertDescription(excludedResults)}
    </Paragraph>
    <LoginLink />
  </StyledAlert>
)

export default AuthAlert
