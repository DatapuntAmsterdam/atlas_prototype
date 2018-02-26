import React from 'react';
import PropTypes from 'prop-types';

import './_draw-tool.scss';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';
import ToggleDrawing from '../toggle-drawing/ToggleDrawing';
import ShapeSummary from '../shape-summary/ShapeSummary';
import PointsAvailable from '../points-available/PointsAvailable';

const DrawTool = ({
  drawingMode,
  isEnabled,
  onClearDrawing, // TODO: rename
  shapeDistanceTxt,
  shapeMarkers,
  toggleDrawing
}) => {
  const markersLeft = drawToolConfig.MAX_MARKERS - shapeMarkers;
  return (
    <section className="draw-tool">
      <ToggleDrawing
        drawingMode={drawingMode}
        shapeMarkers={shapeMarkers}
        toggleDrawing={toggleDrawing}
      />
      {
        !isEnabled && shapeMarkers === 2
        &&
        <ShapeSummary
          shapeDistanceTxt={shapeDistanceTxt}
          onClearDrawing={onClearDrawing}
        />
      }
      {
        markersLeft <= drawToolConfig.MARKERS_LEFT_WARNING &&
        isEnabled &&
        <PointsAvailable
          markersLeft={markersLeft}
          drawingMode={drawingMode}
        />
      }
    </section>
  );
};

DrawTool.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  onClearDrawing: PropTypes.func.isRequired,
  shapeDistanceTxt: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired,
  toggleDrawing: PropTypes.func.isRequired
};

export default DrawTool;
