import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ label, count, onClick, isCurrentTab }) => (
  <li key={label} className={isCurrentTab ? 'is-active' : ''}>
    {!isCurrentTab &&
    <button
      type="button"
      onClick={onClick}
      className="o-tabs__tab o-tabs__tab--link"
    >
      {label} {(count !== null) && <span>({count})</span>}
    </button>
    }
    {isCurrentTab &&
    <span className="qa-tab-header__active o-tabs__tab o-tabs__tab--active">
      {label} {(count !== null) && <span>({count})</span>}
    </span>
    }
  </li>
);

Tab.defaultProps = {
  count: 0, // TODO: default waarde is undefined toch?
  // Anders heeft die guard hierboven ook geen zin!
  isCurrentTab: false
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  isCurrentTab: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Tab;
