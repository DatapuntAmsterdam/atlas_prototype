import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Heading, Paragraph } from '@datapunt/asc-ui'
import LoginLinkContainer from '../Links/LoginLink/LoginLinkContainer'
import NotificationLevel from '../../models/notification'

const MoreResultsWhenLoggedIn = ({ excludedResults }) => (
  <Alert level={NotificationLevel.Attention} dismissible>
    <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>
    <Paragraph>
      {'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om ' +
        `meer te vinden${excludedResults ? `: ${excludedResults}` : ''}. `}
    </Paragraph>
    <LoginLinkContainer />
  </Alert>
)

MoreResultsWhenLoggedIn.defaultProps = {
  excludedResults: '',
}

MoreResultsWhenLoggedIn.propTypes = {
  excludedResults: PropTypes.string,
}

export default MoreResultsWhenLoggedIn
