import React from 'react';
import PropTypes from 'prop-types';

import './ToggleFullscreen.scss';

const ToggleFullscreen = ({ isFullscreen, title, onToggleFullscreen, alignLeft = false }) => (
  <button
    title={isFullscreen ? `${title} verkleinen` : `${title} vergroten`}
    className={`toggle-fullscreen toggle-fullscreen${(alignLeft) ? '__left' : '__right'}`}
    onClick={() => onToggleFullscreen()}
  >
    <span className={`
      toggle-fullscreen__icon
      toggle-fullscreen__icon--${isFullscreen ? 'minimize' : 'maximize'}
    `}
    />
  </button>
);

ToggleFullscreen.defaultProps = {
  alignLeft: false
};

ToggleFullscreen.propTypes = {
  alignLeft: PropTypes.bool,
  isFullscreen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
};

export default ToggleFullscreen;
