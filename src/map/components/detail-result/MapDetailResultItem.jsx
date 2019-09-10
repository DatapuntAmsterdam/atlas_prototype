import React from 'react'
import PropTypes from 'prop-types'

const MapDetailResultItem = ({ label, value, link, hasMultiline, status = '' }) => {
  return (
    value && (
      <li className="map-detail-result__item">
        <section className="map-detail-result__item-content">
          <div className="map-detail-result__item-label">{label}</div>
          <div
            className={`map-detail-result__item-value${
              hasMultiline ? '--multiline' : ''
            }           ${
              status && status.length ? `map-detail-result__item-value--${status}` : ''
            }`}
          >
            {link ? (
              <a
                className="o-btn o-btn--link map-detail-result__item-value--inline"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                {value}
              </a>
            ) : (
              value
            )}
          </div>
        </section>
      </li>
    )
  )
}

MapDetailResultItem.defaultProps = {
  value: '',
  hasMultiline: false,
  link: false,
}

MapDetailResultItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hasMultiline: PropTypes.bool,
}

export default MapDetailResultItem
