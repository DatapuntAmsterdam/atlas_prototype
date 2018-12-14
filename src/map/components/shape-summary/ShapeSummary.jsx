import React from 'react';
import PropTypes from 'prop-types';

import './_shape-summary.scss';

const ShapeSummary = ({ shapeDistanceTxt, onClearDrawing }) => (
  <div className="shape-summary">
    <span
      className="shape-summary__label"
      aria-label={`Lijn: ${shapeDistanceTxt}`}
    >Lijn: {shapeDistanceTxt}
    </span>
    <button
      className="shape-summary__button"
      onClick={onClearDrawing}
      title="Lijn verwijderen"
    >
      <span className="shape-summary__button--close" />
    </button>
  </div>
);

ShapeSummary.propTypes = {
  shapeDistanceTxt: PropTypes.string.isRequired,
  onClearDrawing: PropTypes.func.isRequired
};

export default ShapeSummary;
