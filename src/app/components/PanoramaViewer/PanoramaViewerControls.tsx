import React, { useContext } from 'react'
import { breakpoint, ViewerContainer } from '@datapunt/asc-ui'
import { Close } from '@datapunt/asc-assets'
import styled from 'styled-components'
import { ControlButton, MapPanelContext } from '@datapunt/arm-core'
import { locationParam } from '../../pages/MapPage/query-params'
import PanoramaViewerMenu from './PanoramaViewerMenu'
import useParam from '../../utils/useParam'
import ViewerInfoBar from '../ViewerInfoBar/ViewerInfoBar'
import MapContext from '../../pages/MapPage/MapContext'
import { ReactComponent as Enlarge } from './enlarge.svg'
import { ReactComponent as Reduce } from './reduce.svg'

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

const PanoramaViewerControls: React.FC<Props> = ({ children, onClose, panoImageDate }) => {
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
            icon={<Close />}
          />
          <ResizeButton
            type="button"
            variant="blank"
            title="Volledig scherm"
            size={44}
            iconSize={40}
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
