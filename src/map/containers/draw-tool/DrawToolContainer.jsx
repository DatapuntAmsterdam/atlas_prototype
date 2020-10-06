import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { endDataSelection, setGeometryFilter } from '../../../shared/ducks/data-selection/actions'
import { getDataSelection } from '../../../shared/ducks/data-selection/selectors'
import DrawTool from '../../components/draw-tool/DrawTool'
import {
  mapClear,
  mapEmptyGeometry,
  mapSetDrawingMode,
  mapUpdateShape,
} from '../../ducks/map/actions'
import {
  getDrawingMode,
  getGeometry,
  getShapeDistanceTxt,
  getShapeMarkers,
  isDrawingEnabled,
} from '../../ducks/map/selectors'
import { currentShape, initialize, isEnabled, setPolygon } from '../../services/draw-tool/draw-tool'
import drawToolConfig from '../../services/draw-tool/draw-tool.config'

const mapStateToProps = (state) => ({
  drawingMode: getDrawingMode(state),
  drawingEnabled: isDrawingEnabled(state),
  shapeMarkers: getShapeMarkers(state),
  shapeDistanceTxt: getShapeDistanceTxt(state),
  dataSelection: getDataSelection(state),
  geometry: getGeometry(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClearDrawing: mapEmptyGeometry,
      onEmptyGeometry: mapEmptyGeometry,
      onMapUpdateShape: mapUpdateShape,
      onSetGeometryFilter: setGeometryFilter,
      onSetDrawingMode: mapSetDrawingMode,
      onEndDrawing: endDataSelection,
      onMapClear: mapClear,
    },
    dispatch,
  )

// TODO: Get all business logic out of this file, probably to Redux!
class DrawToolContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onFinishShape = this.onFinishShape.bind(this)
    this.onDrawingMode = this.onDrawingMode.bind(this)
    this.onUpdateShape = this.onUpdateShape.bind(this)
    this.setPolygon = this.setPolygon.bind(this)
    this.getMarkers = this.getMarkers.bind(this)

    const { initialize: initializeProp, leafletInstance } = this.props
    initializeProp(leafletInstance, this.onFinishShape, this.onDrawingMode, this.onUpdateShape)

    this.setPolygon()
  }

  componentDidUpdate(prevProps) {
    const { geometry, dataSelection } = this.props
    // Clear Polygon if the dataSelection filter changes
    if (prevProps.dataSelection.geometryFilter !== dataSelection.geometryFilter) {
      this.setPolygon()
    }

    // if the markers have changed save the old markers as previous markers
    if (prevProps.geometry !== geometry) {
      this.setPolygon()
    }
  }

  componentWillUnmount() {
    const { onMapClear, drawingMode } = this.props

    // Only clear the map when drawing mode was enabled
    if (drawingMode !== drawToolConfig.DRAWING_MODE.NONE) onMapClear()
  }

  onFinishShape(polygon) {
    const { onSetGeometryFilter } = this.props
    if (polygon && polygon.markers && polygon.markers.length > 2) {
      onSetGeometryFilter(polygon)
    }
  }

  onDrawingMode(drawingMode) {
    const { onSetDrawingMode } = this.props
    onSetDrawingMode({ drawingMode })
  }

  onUpdateShape(newShape) {
    const { onMapUpdateShape } = this.props
    onMapUpdateShape({
      shapeMarkers: newShape.markers.length,
      shapeDistanceTxt: newShape.distanceTxt,
      shapeAreaTxt: newShape.areaTxt,
    })
  }

  setPolygon() {
    const { onSetPolygon } = this.props
    if (!isEnabled()) {
      onSetPolygon(this.getMarkers())
    }
  }

  getMarkers() {
    const { geometry, dataSelection } = this.props
    return geometry?.length > 0 ? geometry : dataSelection?.geometryFilter?.markers ?? []
  }

  render() {
    const { shapeMarkers, drawingMode, drawingEnabled } = this.props
    const markersLeft = drawToolConfig.MAX_MARKERS - shapeMarkers
    return (
      <DrawTool
        markersLeft={markersLeft}
        {...{
          shapeMarkers,
          drawingMode,
          drawingEnabled,
        }}
      />
    )
  }
}

/* eslint-disable react/forbid-prop-types */
DrawToolContainer.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired,
  shapeDistanceTxt: PropTypes.string.isRequired,
  dataSelection: PropTypes.shape({
    geometryFilter: PropTypes.shape({
      markers: PropTypes.array,
    }),
  }),
  // Todo: figure out what shape the array is
  geometry: PropTypes.array, // eslint-disable-line

  currentShape: PropTypes.shape({
    markers: PropTypes.array,
  }),

  leafletInstance: PropTypes.shape({}).isRequired,

  drawingEnabled: PropTypes.bool.isRequired,
  onSetPolygon: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,

  onClearDrawing: PropTypes.func.isRequired,
  onEmptyGeometry: PropTypes.func.isRequired,
  onMapUpdateShape: PropTypes.func.isRequired,
  onSetGeometryFilter: PropTypes.func.isRequired,
  onSetDrawingMode: PropTypes.func.isRequired,
  onEndDrawing: PropTypes.func.isRequired,
  onMapClear: PropTypes.func.isRequired,
}

DrawToolContainer.defaultProps = {
  dataSelection: null,
  geometry: [],
  currentShape: null,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)((props) => (
  <DrawToolContainer
    currentShape={currentShape}
    initialize={initialize}
    onSetPolygon={setPolygon}
    {...props}
  />
))
