import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const Button = ({ title, onClick, children, alignLeft, padding }) => (
  <button
    type="button"
    title={title}
    className={`button-new button-new${(alignLeft) ? '__left' : '__right'}`}
    onClick={onClick}
    style={{
      padding: `${padding}px`
    }}
  >
    {children}
  </button>
);

Button.defaultProps = {
  alignLeft: false,
  children: null,
  padding: 4
};

Button.propTypes = {
  alignLeft: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  padding: PropTypes.number
};

export default Button;
