import React from 'react'
import PropTypes from 'prop-types'

const Tab = ({ label, count, onClick, isSelected, page }) => (
  <li key={page} className={isSelected ? 'is-active' : ''}>
    {!isSelected && (
      <button type="button" onClick={onClick} className="o-tabs__tab o-tabs__tab--link">
        {label}
      </button>
    )}
    {isSelected && (
      <span className="qa-tab-header__active o-tabs__tab o-tabs__tab--active">
        {label} {count !== null && <span>({count})</span>}
      </span>
    )}
  </li>
)

Tab.defaultProps = {
  count: 0,
  isSelected: false,
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
}

export default Tab
