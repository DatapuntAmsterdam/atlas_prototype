import { ControlButton, MapPanelContext } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'
import { breakpoint, ViewerContainer } from '@amsterdam/asc-ui'
import { useContext, FunctionComponent } from 'react'
import styled from 'styled-components'
import MapContext from '../../pages/MapPage/MapContext'
import { locationParam } from '../../pages/MapPage/query-params'
import useParam from '../../utils/useParam'
import ViewerInfoBar from '../ViewerInfoBar/ViewerInfoBar'
import Enlarge from './enlarge.svg'
import PanoramaViewerMenu from './PanoramaViewerMenu'
import Reduce from './reduce.svg'

type Props = {
  onClose: (boolean: boolean) => void
  panoFullScreen: boolean
  panoImageDate?: string
}

const ResizeButton = styled(ControlButton)`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none; // below tabletM is always full screen, so no need to show this button
  }
`

const PanoramaViewerControls: FunctionComponent<Props> = ({ children, onClose, panoImageDate }) => {
  const { drawerPosition } = useContext(MapPanelContext)
  const { panoFullScreen, setPanoFullScreen } = useContext(MapContext)
  const [location] = useParam(locationParam)

  return (
    <ViewerContainer
      // @ts-ignore
      style={!panoFullScreen ? { left: drawerPosition } : {}}
      topRight={
        <>
          <ControlButton
            type="button"
            variant="blank"
            title="Panorama sluiten"
            size={44}
            iconSize={25}
            onClick={onClose}
            data-testid="panoramaViewerCloseButton"
            icon={<Close />}
          />
          <ResizeButton
            type="button"
            variant="blank"
            title="Volledig scherm"
            size={44}
            iconSize={40}
            data-testid="panoramaViewerFullscreenButton"
            onClick={() => {
              setPanoFullScreen(!panoFullScreen)
            }}
            icon={panoFullScreen ? <Reduce /> : <Enlarge />}
          />
        </>
      }
      bottomLeft={<PanoramaViewerMenu />}
      bottomRight={
        location && panoImageDate && <ViewerInfoBar date={panoImageDate} location={location} />
      }
    >
      {children}
    </ViewerContainer>
  )
}

export default PanoramaViewerControls
