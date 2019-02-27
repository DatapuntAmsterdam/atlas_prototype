import React from 'react';
import PropTypes from 'prop-types';
import './LoadingIndicator.scss';

const LoadingIndicator = ({ loading }) => (
  <div className={`qa-loading-indicator ${loading ? 'is-loading' : ''}`}>
    <div className="c-loading-indicator c-loading-indicator--box">
      <img className="c-loading-indicator__icon" src="/assets/images/spinner.svg" alt="" />
      <span className="c-loading-indicator__text">Bezig met laden...</span>
    </div>
  </div>
);

LoadingIndicator.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default LoadingIndicator;
