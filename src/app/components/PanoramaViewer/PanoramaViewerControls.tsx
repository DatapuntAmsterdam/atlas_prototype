import { Close } from '@amsterdam/asc-assets'
import { breakpoint, Button, ViewerContainer } from '@amsterdam/asc-ui'
import { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import Control from '../../pages/MapPage/components/Control'
import MapContext from '../../pages/MapPage/MapContext'
import { locationParam } from '../../pages/MapPage/query-params'
import useParam from '../../utils/useParam'
import ViewerInfoBar from '../ViewerInfoBar/ViewerInfoBar'
import Enlarge from './enlarge.svg'
import PanoramaViewerMenu from './PanoramaViewerMenu'
import Reduce from './reduce.svg'

export interface PanoramaViewerControlsProps {
  onClose: () => void
  panoFullScreen: boolean
  panoImageDate?: string
}

const ResizeButton = styled(Button)`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none; // below tabletM is always full screen, so no need to show this button
  }
`

const PanoramaViewerControls: FunctionComponent<PanoramaViewerControlsProps> = ({
  children,
  onClose,
  panoImageDate,
}) => {
  const { panoFullScreen, setPanoFullScreen } = useContext(MapContext)
  const [location] = useParam(locationParam)

  // TODO: Add the pano viewer to the map overlay.

  return (
    <ViewerContainer
      topRight={
        <Control>
          <Button
            type="button"
            variant="blank"
            title="Panorama sluiten"
            size={44}
            iconSize={25}
            // @ts-ignore
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
        </Control>
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
