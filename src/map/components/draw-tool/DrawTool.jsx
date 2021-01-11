import PropTypes from 'prop-types'
import drawToolConfig from '../../services/draw-tool/draw-tool.config'
import ToggleDrawing from '../toggle-drawing/ToggleDrawingContainer'
import ShapeSummary from '../shape-summary/ShapeSummaryContainer'
import PointsAvailable from '../points-available/PointsAvailable'

const DrawTool = ({ drawingMode, drawingEnabled, shapeMarkers, markersLeft }) => (
  <section className="draw-tool">
    <ToggleDrawing />
    {!drawingEnabled && shapeMarkers === 2 && <ShapeSummary />}
    {markersLeft <= drawToolConfig.MARKERS_LEFT_WARNING && drawingEnabled && (
      <PointsAvailable markersLeft={markersLeft} drawingMode={drawingMode} />
    )}
  </section>
)

DrawTool.propTypes = {
  drawingMode: PropTypes.string.isRequired,
  drawingEnabled: PropTypes.bool.isRequired,
  shapeMarkers: PropTypes.number.isRequired,
  markersLeft: PropTypes.number.isRequired,
}

export default DrawTool
