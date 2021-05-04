import { useIsEmbedded } from '../../../../contexts/ui'
import Control from '../Control'
import DrawTool from '../DrawTool/DrawTool'

const DrawToolControl = () => {
  const isEmbedded = useIsEmbedded()

  if (isEmbedded) {
    return null
  }

  return (
    <Control data-testid="drawtoolControl">
      <DrawTool />
    </Control>
  )
}

export default DrawToolControl
