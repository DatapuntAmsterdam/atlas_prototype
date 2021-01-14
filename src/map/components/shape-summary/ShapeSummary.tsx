import { Button } from '@amsterdam/asc-ui'
import { Close } from '@amsterdam/asc-assets'
import { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react'

type Props = {
  shapeDistanceTxt: string
  onClearDrawing: (
    event: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
  ) => void
}

const ShapeSummary: FunctionComponent<Props> = ({ shapeDistanceTxt, onClearDrawing }) => (
  <div className="shape-summary">
    <span className="shape-summary__label" aria-label={`Lijn: ${shapeDistanceTxt}`}>
      Lijn:
      {shapeDistanceTxt}
    </span>

    <Button
      title="Lijn verwijderen"
      type="button"
      size={24}
      variant="blank"
      onClick={onClearDrawing}
      iconSize={18}
      icon={<Close />}
    />
  </div>
)

export default ShapeSummary
