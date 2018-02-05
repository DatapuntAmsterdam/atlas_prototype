import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isEqual from 'lodash.isequal';

import DrawTool from '../../components/draw-tool/DrawTool';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';

import { mapClearDrawing, mapUpdateShape, mapStartDrawing, mapEndDrawing } from '../../../shared/ducks/map/map';
import { setDataSelectionGeometryFilter, resetDataSelectionGeometryFilter } from '../../../shared/ducks/data-selection/data-selection';
import { setPageName } from '../../../shared/ducks/page/page';
import { setMapFullscreen } from '../../../shared/ducks/ui/ui';

import {
  cancel,
  currentShape,
  initialize,
  setPolygon
} from '../../services/draw-tool/draw-tool';
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
  onClearDrawing: mapClearDrawing,
  onMapUpdateShape: mapUpdateShape,
  setGeometryFilter: setDataSelectionGeometryFilter,
  resetGeometryFilter: resetDataSelectionGeometryFilter,
  onStartDrawing: mapStartDrawing,
  onEndDrawing: mapEndDrawing,
  onSetPageName: setPageName,
  onSetMapFullscreen: setMapFullscreen
}, dispatch);

// TODO: Get all business logic out of this file, probably to Redux!
class DrawToolContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawingMode: props.drawingMode,
      previousMarkers: []
    };

    this.onFinishShape = this.onFinishShape.bind(this);
    this.onDrawingMode = this.onDrawingMode.bind(this);
    this.onUpdateShape = this.onUpdateShape.bind(this);
    this.setPolygon = this.setPolygon.bind(this);
    this.getMarkers = this.getMarkers.bind(this);

    this.props.initialize(
      window.leafletMap,
      this.onFinishShape,
      this.onDrawingMode,
      this.onUpdateShape
    );

    this.setPolygon();
  }

  componentWillReceiveProps(props) {
    const markers = this.getMarkers();

    if (!isEqual(this.state.previousMarkers, markers)) {
      // if the markers have changed save the new markers as previous markers
      this.setPolygon();
      this.setState({ previousMarkers: [...markers] });
    }

    if (props.dataSelection === null && props.geometry === null &&
      props.drawingMode === drawToolConfig.DRAWING_MODE.NONE) {
      // if dataSelection and geometry are empty then remove the drawn polygon
      this.props.setPolygon([]);
    }

    if (this.state.drawingMode !== props.drawingMode) {
      if (props.drawingMode === drawToolConfig.DRAWING_MODE.NONE) {
        // after drawing mode has changed the draw tool should be cancelled after navigating
        this.props.cancel();
      }
      this.setState({ drawingMode: props.drawingMode });
    }
  }

  onFinishShape(polygon) {
    const has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
    const moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

    if (moreThan2Markers && !isEqual(this.state.previousMarkers, polygon.markers)) {
      this.props.setGeometryFilter({
        markers: polygon.markers,
        description: `${polygon.distanceTxt} en ${polygon.areaTxt}`
      });

      this.props.onEndDrawing({ polygon });
      this.props.onSetPageName({ name: null });

      this.props.onSetMapFullscreen({ isMapFullscreen: false });
    } else if (has2Markers) {
      this.props.onEndDrawing({ polygon });
    }
  }

  onDrawingMode(drawingMode) {
    if (drawingMode !== drawToolConfig.DRAWING_MODE.NONE) {
      this.setState({ previousMarkers: [...this.props.currentShape.markers] });
      this.props.resetGeometryFilter({ drawingMode });
      this.props.onStartDrawing({ drawingMode });
    } else {
      this.props.onEndDrawing();
    }
  }

  onUpdateShape(newShape) {
    this.props.onMapUpdateShape({
      shapeMarkers: newShape.markers.length,
      shapeDistanceTxt: newShape.distanceTxt,
      shapeAreaTxt: newShape.areaTxt
    });
  }

  setPolygon() {
    if (!this.props.isEnabled) {
      this.props.setPolygon(this.getMarkers());
    }
  }

  getMarkers() {
    return this.props.geometry && this.props.geometry.length > 0 ? this.props.geometry :
      ((this.props.dataSelection && this.props.dataSelection.geometryFilter &&
      this.props.dataSelection.geometryFilter.markers) || []);
  }

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
  dataSelection: PropTypes.object,
  geometry: PropTypes.array,

  currentShape: PropTypes.object,

  toggleDrawing: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  setPolygon: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,

  onClearDrawing: PropTypes.func.isRequired,
  onMapUpdateShape: PropTypes.func.isRequired,
  setGeometryFilter: PropTypes.func.isRequired,
  resetGeometryFilter: PropTypes.func.isRequired,
  onStartDrawing: PropTypes.func.isRequired,
  onEndDrawing: PropTypes.func.isRequired,
  onSetPageName: PropTypes.func.isRequired,
  onSetMapFullscreen: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)((props) => (
  <DrawToolContainer
    currentShape={currentShape}
    toggleDrawing={toggleDrawing}
    cancel={cancel}
    initialize={initialize}
    setPolygon={setPolygon}
    {...props}
  />
  )
);
