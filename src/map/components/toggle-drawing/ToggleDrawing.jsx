import React from 'react';
import PropTypes from 'prop-types';

import { DRAWING_MODE } from '../../services/draw-tool/draw-tool-config';

import IconMeasure from '../../../../public/images/icon-measure.svg';

import './_toggle-drawing.scss';

const ToggleDrawing = ({ drawingMode, shapeMarkers, toggleDrawing }) => {
  const title = drawingMode !== DRAWING_MODE.NONE ? 'Eindig' :
    (shapeMarkers > 0 ? 'Opnieuw' : 'Begin');
  const label = title === 'Begin' ? '' : title;

  return (<button
    className="toggle-drawing"
    onClick={() => toggleDrawing(shapeMarkers)}
    title={`${title} meten en intekenen`}
  >
    <IconMeasure className="toggle-drawing__icon" />
    <span className="toggle-drawing__label">
      {label}
    </span>
  </button>
  );
};

ToggleDrawing.propTypes = {
  toggleDrawing: PropTypes.func.isRequired,
  drawingMode: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired
};

export default ToggleDrawing;
