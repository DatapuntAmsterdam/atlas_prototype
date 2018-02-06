//
// Connects Redux state changes to Leaflet draw
//
import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setPolygon } from '../../services/draw-tool/draw-tool';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';
import initialize from '../../services/draw-tool/leaflet-draw-to-redux';

import {
  mapUpdateShape,
  mapStartDrawing,
  mapEndDrawing
} from '../../../shared/ducks/map/map';
import {
  setDataSelectionGeometryFilter,
  resetDataSelectionGeometryFilter
} from '../../../shared/ducks/data-selection/data-selection';
import { setPageName } from '../../../shared/ducks/page/page';
import { setMapFullscreen } from '../../../shared/ducks/ui/ui';

// When state changes, possibly update leaflet drawing.
const consolidateState = (stateMarkers, drawMode, currentShape) => {
  const drawnMarkers = currentShape.layer
    && currentShape.layer.getLatLngs()
    && currentShape.layer.getLatLngs()[0] || []; // eslint-disable-line no-mixed-operators

  if (drawMode === drawToolConfig.DRAWING_MODE.NONE) {
    if (drawnMarkers.length !== stateMarkers.length) {
      setPolygon(stateMarkers);
    }
  }
};

class LeafletDrawContainer extends React.Component {
  constructor(props) {
    super(props);

    // Connect leaflet draw to redux via action dispatchers
    this.currentShape = initialize(props, window.leafletMap);

    consolidateState(props.markers, props.drawingMode, this.currentShape);
  }

  componentWillReceiveProps(props) {
    consolidateState(props.markers, props.drawingMode, this.currentShape);
  }

  render() {
    return null;
  }
}

LeafletDrawContainer.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  markers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
};

const mapStateToProps = (state) => ({
  drawingMode: state.map.drawingMode,
  markers: state.map.geometry || []
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  mapUpdateShape,
  mapStartDrawing,
  mapEndDrawing,
  setDataSelectionGeometryFilter,
  resetDataSelectionGeometryFilter,
  setPageName,
  setMapFullscreen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LeafletDrawContainer);
