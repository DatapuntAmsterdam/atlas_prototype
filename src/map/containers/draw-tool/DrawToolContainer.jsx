import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DrawTool from '../../components/draw-tool/DrawTool';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';

import {
  mapClearDrawing
} from '../../../shared/ducks/map/map';

import initialize from '../../services/draw-tool/draw-tool-factory';
import toggleDrawing from '../../services/draw-tool/draw-tool-toggle';

const mapStateToProps = (state) => ({
  drawingMode: state.map.drawingMode,
  isEnabled: state.map.drawingMode !== drawToolConfig.DRAWING_MODE.NONE,
  shapeMarkers: state.map.shapeMarkers,
  shapeDistanceTxt: state.map.shapeDistanceTxt,
  dataSelection: state.dataSelection,
  geometry: state.map.geometry,
  uiMapFullscreen: state.ui.isMapFullscreen
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onClearDrawing: mapClearDrawing
}, dispatch);

// TODO: Get all business logic out of this file, probably to Redux!
class DrawToolContainer extends React.Component {
  constructor(props) {
    super(props);

    initialize(window.leafletMap, window.reduxStore.dispatch);

  //   this.setPolygon();
  }

  // componentWillReceiveProps(props) {
  //   const markers = this.getMarkers();

  //   if (!isEqual(this.state.previousMarkers, markers)) {
  //     // if the markers have changed save the new markers as previous markers
  //     this.setPolygon();
  //     this.setState({ previousMarkers: [...markers] });
  //   }

  //   if (props.dataSelection === null && props.geometry === null &&
  //     props.drawingMode === drawToolConfig.DRAWING_MODE.NONE) {
  //     // if dataSelection and geometry are empty then remove the drawn polygon
  //     this.props.setPolygon([]);
  //   }

  //   if (this.state.drawingMode !== props.drawingMode) {
  //     if (props.drawingMode === drawToolConfig.DRAWING_MODE.NONE) {
  //       // after drawing mode has changed the draw tool should be cancelled after navigating
  //       this.props.cancel();
  //     }
  //     this.setState({ drawingMode: props.drawingMode });
  //   }
  // }


  render() {
    const markersLeft = drawToolConfig.MAX_MARKERS - this.props.shapeMarkers;
    return (<DrawTool
      markersLeft={markersLeft}
      {...this.props}
      isEnabled={this.props.isEnabled}
    />);
  }
}

DrawToolContainer.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired,
  shapeDistanceTxt: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,

  onClearDrawing: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)((props) => (
  <DrawToolContainer
    toggleDrawing={toggleDrawing}
    {...props}
  />
  )
);
