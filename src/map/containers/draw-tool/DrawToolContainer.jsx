import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DrawTool from '../../components/draw-tool/DrawTool';
import { DRAWING_MODE, MAX_MARKERS } from '../../services/draw-tool/draw-tool-config';
import toggleDrawing from '../../services/draw-tool/draw-tool-toggle';
import { mapClearDrawing } from '../../../shared/ducks/map/map';

const mapStateToProps = (state) => ({
  drawingMode: state.map.drawingMode,
  isEnabled: state.map.drawingMode !== DRAWING_MODE.NONE,
  shapeMarkers: state.map.shapeMarkers,
  shapeDistanceTxt: state.map.shapeDistanceTxt
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onClearDrawing: mapClearDrawing
}, dispatch);

const DrawToolContainer = (props) => {
  const markersLeft = MAX_MARKERS - props.shapeMarkers;
  return (<DrawTool
    markersLeft={markersLeft}
    {...props}
  />);
};

DrawToolContainer.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  onClearDrawing: PropTypes.func.isRequired,
  shapeDistanceTxt: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)((props) => (
  <DrawToolContainer
    toggleDrawing={toggleDrawing}
    {...props}
  />
  )
);
