import React from 'react';
import { getEmbedButtonLink } from '../../../shared/services/embed-url/embed-url';

const MapEmbedButton = () => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      window.open(getEmbedButtonLink(), '_blank');
    }}
    title="Naar interactieve kaart (Amsterdam City Data)"
    className="c-embed-button qa-embed-button"
  >
    <span className="c-embed-button__icon c-embed-button__icon--maximize" />
    <span className="c-embed-button__label">City Data</span>
  </button>
);

export default MapEmbedButton;
