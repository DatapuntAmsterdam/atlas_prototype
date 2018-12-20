import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const Button = ({ title, onClick, children, alignLeft }) => (
  <button
    title={title}
    className={`button-new button-new${(alignLeft) ? '__left' : '__right'}`}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  alignLeft: false,
  children: null
};

Button.propTypes = {
  alignLeft: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Button;
