import React from 'react';
import PropTypes from 'prop-types';

import IconCrossBig from '../../../../public/images/icon-cross-big.svg';

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
      <IconCrossBig
        className="shape-summary__icon"
      />
    </button>
  </div>
);

ShapeSummary.propTypes = {
  shapeDistanceTxt: PropTypes.string.isRequired,
  onClearDrawing: PropTypes.func.isRequired
};

export default ShapeSummary;
