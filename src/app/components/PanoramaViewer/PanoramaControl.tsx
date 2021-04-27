import { useCallback, useMemo } from 'react'
import { ControlButton } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'
import styled from 'styled-components'
import { breakpoint } from '@amsterdam/asc-ui'
import { useHistory, useLocation } from 'react-router-dom'
import Reduce from './reduce.svg'
import { useMapContext } from '../../pages/MapPage/MapContext'
import Enlarge from './enlarge.svg'
import {
  mapLayersParam,
  panoFovParam,
  panoFullScreenParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
} from '../../pages/MapPage/query-params'
import useBuildQueryString from '../../utils/useBuildQueryString'
import { PANO_LAYERS } from './PanoramaViewer'
import useParam from '../../utils/useParam'
import Control from '../../pages/MapPage/components/Control'

const ResizeButton = styled(ControlButton)`
  margin-top: 2px;
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none; // below tabletM is always full screen, so no need to show this button
  }
`

const StyledControl = styled(Control)`
  align-self: flex-end;
`

const PanoramaControl = () => {
  const { panoFullScreen, setPanoFullScreen } = useMapContext()
  const history = useHistory()
  const browserLocation = useLocation()
  const { buildQueryString } = useBuildQueryString()
  const [activeLayers] = useParam(mapLayersParam)

  const activeLayersWithoutPano = useMemo(
    () => activeLayers.filter((id) => !PANO_LAYERS.includes(id)),
    [activeLayers],
  )

  const onClose = useCallback(() => {
    history.push({
      pathname: browserLocation.pathname,
      search: buildQueryString(
        [[mapLayersParam, activeLayersWithoutPano]],
        [panoHeadingParam, panoPitchParam, panoTagParam, panoFovParam, panoFullScreenParam],
      ),
    })
  }, [browserLocation])

  return (
    <StyledControl data-testid="panoramaControls">
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
    </StyledControl>
  )
}

export default PanoramaControl
