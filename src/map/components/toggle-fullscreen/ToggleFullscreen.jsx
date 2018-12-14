import React from 'react';
import PropTypes from 'prop-types';

import './_toggle-fullscreen.scss';

const ToggleFullscreen = ({ isFullscreen, onToggleFullscreen }) => (
  <button
    title={isFullscreen ? 'Kaart verkleinen' : 'Kaart vergroten'}
    className="toggle-fullscreen"
    onClick={() => onToggleFullscreen()}
  >
    <span className={`
      toggle-fullscreen__icon
      toggle-fullscreen__icon--${isFullscreen ? 'minimize' : 'maximize'}
    `}
    />
  </button>
);

ToggleFullscreen.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
};

export default ToggleFullscreen;
