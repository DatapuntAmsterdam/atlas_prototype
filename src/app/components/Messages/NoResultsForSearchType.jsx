import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link/dist/Link';
import { routing } from '../../routes';
import { BEDIENING_LOGIN_DEEPLINK } from '../../pages/CMSPageMapping';

const NoResultsForSearchType = ({ message, authMessage }) => (
  <div className="c-link__wrapper--inine-block">
    <div className="u-margin__bottom--1">Geen resultaten van deze soort</div>
    { message }
    { authMessage && (
      <span>
        &nbsp;Medewerkers/ketenpartners van Gemeente Amsterdam kunnen
        inloggen om meer gegevens te zien, zie <Link
          to={{
            type: routing.bediening.type,
            payload: { deeplink: BEDIENING_LOGIN_DEEPLINK } /* TODO DP-6485 */
          }}
        >
          Help &#62; Bediening &#62; Inloggen
        </Link>
      </span>
    )}
  </div>
);

NoResultsForSearchType.defaultProps = {
  message: '',
  authMessage: false
};

NoResultsForSearchType.propTypes = {
  message: PropTypes.string,
  authMessage: PropTypes.bool
};

export default NoResultsForSearchType;
