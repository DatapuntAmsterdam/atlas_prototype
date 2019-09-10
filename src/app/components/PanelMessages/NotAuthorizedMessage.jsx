import React from 'react'
import PropTypes from 'prop-types'
import Notification from '../../../shared/components/notification/Notification'
import { SCOPES } from '../../../shared/services/auth/auth'
import LoginLinkContainer from '../Links/LoginLink/LoginLinkContainer'

const NotAuthorizedMessage = ({ scopeError, type }) => {
  return (
    <Notification type="warning">
      <div>
        <p className="c-panel__paragraph">
          {scopeError === SCOPES['BRK/RSN']
            ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken. `
            : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om ${type} te bekijken. `}
        </p>
        <LoginLinkContainer />
      </div>
    </Notification>
  )
}

NotAuthorizedMessage.defaultProps = {
  type: 'maatschappelijke activiteiten en vestigingen',
  scopeError: '',
}

NotAuthorizedMessage.propTypes = {
  type: PropTypes.string,
  scopeError: PropTypes.string,
}

export default NotAuthorizedMessage
