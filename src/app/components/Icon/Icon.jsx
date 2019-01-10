import React from 'react';
import PropTypes from 'prop-types';

import './Icon.scss';

const Icon = ({ icon }) => (
  <span
    className={`
      rc-icon
      rc-icon--${icon}
    `}
  />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired
};

export default Icon;
