import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ControlButton } from '@amsterdam/arm-core'
import { useSelector } from 'react-redux'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Measure from '../../../shared/assets/icons/icon-measure.svg'
import { isEmbedded, isEmbedPreview, isPrintMode } from '../../../shared/ducks/ui/ui'

export const StyledControlButton = styled(ControlButton)`
  position: absolute;
  left: ${themeSpacing(2)};
  top: ${themeSpacing(2)};
  z-index: 1;

  svg path {
    fill: ${themeColor('tint', 'level7')};
  }
`

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
  const printMode = useSelector(isPrintMode)
  const embedMode = useSelector(isEmbedded)
  const embedPreviewMode = useSelector(isEmbedPreview)

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

  if (printMode || embedMode || embedPreviewMode) {
    return null
  }

  return (
    <>
      {expanded ? (
        <StyledControlButton
          variant="blank"
          title={`${label} meten en intekenen`}
          iconLeft={<Measure />}
          iconSize={28}
          onClick={clickEvent}
          data-testid="drawToolButton"
        >
          <span className="toggle-drawing__label">{label}</span>
        </StyledControlButton>
      ) : (
        <StyledControlButton
          title={`${label} meten en intekenen`}
          icon={<Measure />}
          variant="blank"
          iconSize={28}
          size={40}
          onClick={clickEvent}
          data-testid="drawToolButton"
        />
      )}
    </>
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
