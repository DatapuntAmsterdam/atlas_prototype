import React, { FunctionComponent } from 'react'
import { Alert, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import NotificationLevel from '../../models/notification'
import LoginLink from '../Links/LoginLink/LoginLink'

export interface MoreResultsWhenLoggedInProps {
  excludedResults?: string
}

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(2)};
`

const MoreResultsWhenLoggedIn: FunctionComponent<MoreResultsWhenLoggedInProps> = ({
  excludedResults = '',
  ...otherProps
}) => (
  <StyledAlert level={NotificationLevel.Attention} dismissible {...otherProps}>
    <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>
    <Paragraph>
      {`Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden${
        excludedResults ? ` over: ${excludedResults}` : ''
      }. `}
    </Paragraph>
    <LoginLink />
  </StyledAlert>
)

export default MoreResultsWhenLoggedIn
