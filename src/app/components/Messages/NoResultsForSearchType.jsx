import React from 'react'
import PropTypes from 'prop-types'
import LoginLinkContainer from '../Links/LoginLink/LoginLinkContainer'

const NoResultsForSearchType = ({ message, authMessage }) => {
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
      <LoginLinkContainer inverted={false} />
    </div>
  )
}

NoResultsForSearchType.defaultProps = {
  message: '',
  authMessage: false,
}

NoResultsForSearchType.propTypes = {
  message: PropTypes.string,
  authMessage: PropTypes.bool,
}

export default NoResultsForSearchType
