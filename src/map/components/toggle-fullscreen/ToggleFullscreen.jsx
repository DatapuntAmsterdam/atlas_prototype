import React from 'react';
import PropTypes from 'prop-types';

import MinimizeIcon from '../../../../public/images/icon-minimize.svg';
import MaximizeIcon from '../../../../public/images/icon-maximize.svg';

import './_toggle-fullscreen.scss';

const ToggleFullscreen = ({ isFullscreen, onToggleFullscreen }) => (
  <button
    className="toggle-fullscreen"
    onClick={() => onToggleFullscreen()}
  >
    {isFullscreen ?
      <MinimizeIcon className="toggle-fullscreen__icon" /> :
      <MaximizeIcon className="toggle-fullscreen__icon" />}
  </button>
);

ToggleFullscreen.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
};

export default ToggleFullscreen;
