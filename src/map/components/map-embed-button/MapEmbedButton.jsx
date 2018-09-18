import React from 'react';
import PropTypes from 'prop-types';

import MaximizeIcon from '../../../../public/images/icon-maximize.svg';

const MapEmbedButton = ({ link }) => (
  <a
    href={link}
    title="Naar interactieve kaart (Amsterdam City Data)"
    className="c-embed-button qa-embed-button"
    target="_blank"
    rel="noopener noreferrer"
  >
    <MaximizeIcon className="c-embed-button__icon" />
    <span className="c-embed-button__label">City Data</span>
  </a>
);

MapEmbedButton.propTypes = {
  link: PropTypes.string.isRequired
};

export default MapEmbedButton;
