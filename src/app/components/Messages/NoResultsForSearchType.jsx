import React from 'react';
import PropTypes from 'prop-types';

const NoResultsForSearchType = ({ message }) => (
  <div>
    <div className="u-margin__bottom--1">Geen resultaten van deze soort</div>
    {message}
  </div>
);

NoResultsForSearchType.propTypes = {
  message: PropTypes.string.isRequired
};

export default NoResultsForSearchType;
