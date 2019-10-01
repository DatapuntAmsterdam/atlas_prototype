import React from 'react'
import PropTypes from 'prop-types'
import LoginLinkContainer from '../Links/LoginLink/LoginLinkContainer'

const NoResultsForSearchType = ({ message, authMessage, hideLoginLink }) => {
  return (
    <div className="-link__wrapper--inine-block">
      <div className="u-margin__bottom--1">Geen resultaten van deze soort</div>
      <div className="u-margin__bottom--1">
        {message}
        {authMessage && (
          <>
            <span>
              &nbsp;Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer
              gegevens te zien.
            </span>
          </>
        )}
      </div>
      {!hideLoginLink && authMessage && <LoginLinkContainer inverted={false} />}
    </div>
  )
}

NoResultsForSearchType.defaultProps = {
  message: '',
  authMessage: false,
  hideLoginLink: false,
}

NoResultsForSearchType.propTypes = {
  message: PropTypes.string,
  authMessage: PropTypes.bool,
  hideLoginLink: PropTypes.bool,
}

export default NoResultsForSearchType
