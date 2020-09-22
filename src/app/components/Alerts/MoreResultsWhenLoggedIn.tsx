import { Alert, Heading, Paragraph } from '@amsterdam/asc-ui'
import React from 'react'
import NotificationLevel from '../../models/notification'
import LoginLink from '../Links/LoginLink/LoginLink'

export interface MoreResultsWhenLoggedInProps {
  excludedResults?: string
}

const MoreResultsWhenLoggedIn: React.FC<MoreResultsWhenLoggedInProps> = ({
  excludedResults = '',
  ...otherProps
}) => (
  <Alert level={NotificationLevel.Attention} dismissible {...otherProps}>
    <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>
    <Paragraph>
      {`Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te vinden${
        excludedResults ? `: ${excludedResults}` : ''
      }. `}
    </Paragraph>
    <LoginLink />
  </Alert>
)

export default MoreResultsWhenLoggedIn
