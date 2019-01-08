import React from 'react';
import PropTypes from 'prop-types';

import './Icon.scss';

const Icon = ({ icon, padding }) => (
  <span
    className={`
      rc-icon
      rc-icon--${icon}
    `}
    style={{
      padding: `${padding}px`
    }}
  />
);

Icon.defaultProps = {
  alignLeft: false,
  padding: 0
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  padding: PropTypes.number
};

export default Icon;
