import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link/dist/Link';
import { routing } from '../../routes';

const NoResultsForSearchType = ({ message }) => (
  <div className="c-link__wrapper--inine-block">
    <div className="u-margin__bottom--1">Geen resultaten van deze soort</div>
    {message} Zie: <Link
      to={{
        type: routing.bediening.type,
        payload: { deeplink: 'inloggen' }
      }}
    >
      Help &#62; Bediening &#62; Inloggen
    </Link>
  </div>
);

NoResultsForSearchType.propTypes = {
  message: PropTypes.string.isRequired
};

export default NoResultsForSearchType;
