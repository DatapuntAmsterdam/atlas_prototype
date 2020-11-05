import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Todo: AfterBeta: can be removed
const LoadingIndicator = ({ loading, showMapLink }) => {
  const loadingIndicatorClasses = classNames({
    'c-loading-indicator__container': true,
    'is-loading': loading,
    'c-loading-indicator__container--with-link': showMapLink,
  })
  return (
    <div className={`${loadingIndicatorClasses}`}>
      <div className="c-loading-indicator__box qa-loading-indicator">
        <img className="c-loading-indicator__icon" src="/assets/images/spinner.svg" alt="" />
        <span className="c-loading-indicator__text">Laden...</span>
      </div>
    </div>
  )
}

LoadingIndicator.defaultProps = {
  showMapLink: false,
}

LoadingIndicator.propTypes = {
  loading: PropTypes.bool.isRequired,
  showMapLink: PropTypes.bool,
}

export default LoadingIndicator
