import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isEqual from 'lodash.isequal';

import DrawTool from '../../components/draw-tool/DrawTool';
import drawToolConfig from '../../services/draw-tool/draw-tool.config';

import { setPageName } from '../../../shared/ducks/page/page';

import {
  cancel,
  currentShape,
  initialize,
  isEnabled,
  setPolygon
} from '../../services/draw-tool/draw-tool';
import toggleDrawing from '../../services/draw-tool/draw-tool-toggle';
import {
  mapClear,
  mapEmptyGeometry,
  mapEndDrawing,
  mapStartDrawing,
  mapUpdateShape
} from '../../ducks/map/map';
import {
  getDrawingMode,
  getGeometry,
  getShapeDistanceTxt,
  getShapeMarkers,
  isDrawingEnabled
} from '../../ducks/map/map-selectors';
import {
  setGeometryFilter
} from '../../../shared/ducks/data-selection/actions';
import { getDataSelection } from '../../../shared/ducks/data-selection/selectors';

const mapStateToProps = (state) => ({
  drawingMode: getDrawingMode(state),
  isEnabled: isDrawingEnabled(state),
  shapeMarkers: getShapeMarkers(state),
  shapeDistanceTxt: getShapeDistanceTxt(state),
  dataSelection: getDataSelection(state),
  geometry: getGeometry(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onClearDrawing: mapEmptyGeometry,
  onEmptyGeometry: mapEmptyGeometry,
  onMapUpdateShape: mapUpdateShape,
  setGeometryFilter,
  onStartDrawing: mapStartDrawing,
  onEndDrawing: mapEndDrawing,
  onMapClear: mapClear,
  onSetPageName: setPageName
}, dispatch);

// TODO: Get all business logic out of this file, probably to Redux!
class DrawToolContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawingMode: props.drawingMode,
      previousMarkers: [],
      dataSelection: null
    };

    this.onFinishShape = this.onFinishShape.bind(this);
    this.onDrawingMode = this.onDrawingMode.bind(this);
    this.onUpdateShape = this.onUpdateShape.bind(this);
    this.setPolygon = this.setPolygon.bind(this);
    this.getMarkers = this.getMarkers.bind(this);

    this.props.initialize(
      this.props.leafletInstance,
      this.onFinishShape,
      this.onDrawingMode,
      this.onUpdateShape
    );

    this.setPolygon();
  }

  componentWillReceiveProps(props) {
    if (!props.dataSelection && props.geometry && props.geometry.length === 0 &&
      props.drawingMode !== drawToolConfig.DRAWING_MODE.DRAW) {
      // if dataSelection and geometry are empty then remove the drawn polygon
      this.props.onEndDrawing();
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

  componentDidUpdate(prevProps) {
    // if the markers have changed save the old markers as previous markers
    if (prevProps.geometry !== this.props.geometry) {
      this.setPolygon();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ previousMarkers: [...prevProps.geometry] });
    }
  }

  // TODO DP-6340: side effect. this resets the visible layers after featching data?
  // componentWillUnmount() {
    // this.props.onMapClear();
  // }

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
    } else if (has2Markers) {
      this.props.onEndDrawing({ polygon });
    }
  }

  onDrawingMode(drawingMode) {
    if (drawingMode !== drawToolConfig.DRAWING_MODE.NONE) {
      this.setState({ previousMarkers: [...this.props.currentShape.markers] });
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
    if (!isEnabled()) {
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
  dataSelection: PropTypes.shape({
    geometryFilter: PropTypes.shape({
      markers: PropTypes.array
    })
  }),
  // Todo: figure out what shape the array is
  geometry: PropTypes.array.isRequired, // eslint-disable-line

  currentShape: PropTypes.shape({
    markers: PropTypes.array
  }).isRequired,

  leafletInstance: PropTypes.shape({}).isRequired,

  toggleDrawing: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  setPolygon: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,

  onClearDrawing: PropTypes.func.isRequired,
  onEmptyGeometry: PropTypes.func.isRequired,
  onMapUpdateShape: PropTypes.func.isRequired,
  setGeometryFilter: PropTypes.func.isRequired,
  onStartDrawing: PropTypes.func.isRequired,
  onEndDrawing: PropTypes.func.isRequired,
  onSetPageName: PropTypes.func.isRequired,
  onMapClear: PropTypes.func.isRequired
};

DrawToolContainer.defaultProps = {
  dataSelection: null,
  geometry: [],
  currentShape: null
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
));
