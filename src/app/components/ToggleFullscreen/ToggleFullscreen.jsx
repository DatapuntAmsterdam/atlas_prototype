import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const ToggleFullscreen = ({ isFullscreen, title, onToggleFullscreen, alignLeft }) => (
  <Button
    title={isFullscreen ? `${title} verkleinen` : `${title} vergroten`}
    onClick={onToggleFullscreen}
    alignLeft={alignLeft}
  >
    <Icon icon={isFullscreen ? 'minimize' : 'maximize'} />
  </Button>
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
