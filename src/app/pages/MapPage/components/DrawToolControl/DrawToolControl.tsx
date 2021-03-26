import { DrawToolOpenButton } from '@amsterdam/arm-draw'
import useParam from '../../../../utils/useParam'
import { drawToolOpenParam } from '../../query-params'
import Control from '../Control'
import DrawTool from '../DrawTool/DrawTool'

const DrawToolControl = () => {
  const [showDrawTool, setShowDrawTool] = useParam(drawToolOpenParam)
  return (
    <Control data-testid="drawtoolControl">
      {!showDrawTool && (
        <DrawToolOpenButton
          data-testid="drawtoolOpenButton"
          onClick={() => {
            setShowDrawTool(true, 'replace')
          }}
        />
      )}
      {showDrawTool && <DrawTool />}
    </Control>
  )
}

export default DrawToolControl
