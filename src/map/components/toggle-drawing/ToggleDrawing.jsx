import PropTypes from 'prop-types'

const ToggleDrawing = ({
  isEnabled,
  shapeMarkers,
  onReset,
  onEnd,
  onStart,
  onCancel,
  shapeDistance,
}) => {
  const expanded = !!(isEnabled || shapeMarkers > 1)
  let label = 'Begin'
  let clickEvent = onStart

  if (expanded) {
    if (isEnabled) {
      label = 'Eindig'
      clickEvent = shapeDistance === '0,0 m' || shapeDistance === '' ? onCancel : onEnd
    } else if (shapeMarkers > 1) {
      label = 'Opnieuw'
      clickEvent = onReset
    }
  }

  return (
    <button
      type="button"
      className={`
      toggle-drawing
      ${expanded ? 'toggle-drawing--expanded' : 'toggle-drawing--collapsed'}
    `}
      onClick={clickEvent}
      title={`${label} meten en intekenen`}
    >
      <span className="toggle-drawing__icon" />
      {expanded && <span className="toggle-drawing__label">{label}</span>}
    </button>
  )
}

ToggleDrawing.propTypes = {
  onEnd: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  shapeDistance: PropTypes.string.isRequired,
  shapeMarkers: PropTypes.number.isRequired,
}

export default ToggleDrawing
