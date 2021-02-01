import { FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Close, Print } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import { hidePrintMode } from '../../../shared/ducks/ui/ui'

const CloseButton = styled(Button)`
  position: absolute;
  right: -42px;
  top: -42px;
`

const PrintHeader: FunctionComponent = () => {
  const dispatch = useDispatch()

  return (
    <div data-testid="printHeader" className="u-grid">
      <div className="u-row">
        <div className="u-col-sm--3">
          <h1 data-testid="printHeaderTitle" className="c-print-header__title">
            Printversie
          </h1>
        </div>
        <div className="u-col-sm--9">
          <nav>
            <div className="c-print-header__print">
              <Button
                variant="primaryInverted"
                iconSize={14}
                onClick={window.print}
                iconLeft={<Print />}
              >
                Printen
              </Button>
            </div>
            <CloseButton
              data-testid="printHeaderClose"
              type="button"
              variant="blank"
              title="Sluiten"
              size={28}
              icon={<Close />}
              iconSize={15}
              onClick={() => dispatch(hidePrintMode())}
            />
          </nav>
        </div>
      </div>
    </div>
  )
}

export default PrintHeader
