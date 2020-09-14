import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { loadScene } from '../../../panorama/services/marzipano/marzipano'
import useParam from '../../utils/useParam'
import {
  locationParam,
  panoFullScreenParam,
  panoViewerSettingsParam,
  panoTagIdParam,
} from '../../pages/MapPage/query-params'
import {
  getImageDataById,
  getImageDataByLocation,
} from '../../../panorama/services/panorama-api/panorama-api'
import PanoramaViewerControls from './PanoramaViewerControls'
import useMarzipano from '../../utils/useMarzipano'
import { PANO_LABELS } from '../../../panorama/ducks/constants'

const MarzipanoView = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

type Props = {
  panoFullScreen: boolean
}

const PanoramaStyle = styled.div<Props>`
  height: ${({ panoFullScreen }) => (panoFullScreen ? '100%' : '50%')};
  position: relative;
  order: -1; // Put the PanoramaViewer above the Map
`

const PanoramaViewer: React.FC = () => {
  const ref = useRef(null)
  const [panoImageDate, setPanoImageDate] = useState()
  const [panoViewerSettings, setPanoViewerSettings] = useParam(panoViewerSettingsParam)
  const [panoTagId, setPanoTagId] = useParam(panoTagIdParam)
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const [location, setLocation] = useParam(locationParam)
  const { marzipanoViewer, currentMarzipanoView } = useMarzipano(ref)

  const onClickHotspot = useCallback(
    async (id: string) => {
      const newPanos = await getImageDataById(
        id,
        PANO_LABELS.find(({ id: labelId }) => labelId === panoTagId)?.tags,
      )
      setLocation({ lat: newPanos.location[0], lng: newPanos.location[1] })
    },
    [setLocation, panoTagId],
  )

  const fetchPanoramaImage = useCallback(
    (res) => {
      if (panoViewerSettings) {
        setPanoImageDate(res.date)
        loadScene(
          marzipanoViewer,
          onClickHotspot,
          res.image,
          panoViewerSettings.heading,
          panoViewerSettings.pitch,
          panoViewerSettings.fov,
          res.hotspots,
        )
      }
    },
    [panoViewerSettings, setPanoImageDate, marzipanoViewer, onClickHotspot],
  )

  // Update the URL queries when the view changes
  useEffect(() => {
    if (currentMarzipanoView) {
      setPanoViewerSettings(currentMarzipanoView, 'replace')
    }
  }, [currentMarzipanoView])

  // Reset the FOV when toggling fullscreen.
  // This will solve the issue that when the viewer is on full screen, it's zoomed in too much
  useEffect(() => {
    if (marzipanoViewer) {
      marzipanoViewer.updateSize() // Updates the stage size to fill the containing element.
      if (panoViewerSettings && marzipanoViewer.view()) {
        setTimeout(() => {
          marzipanoViewer.view().setFov(100) // some high number, the viewer itself will set the max FOV
        }, 0)
      }
    }
  }, [marzipanoViewer, panoFullScreen])

  // Fetch image when the location changes
  useEffect(() => {
    if (marzipanoViewer && location && panoViewerSettings) {
      ;(async () => {
        const res = await getImageDataByLocation(
          [location.lat, location.lng],
          PANO_LABELS.find(({ id }) => id === panoTagId)?.tags,
        )
        fetchPanoramaImage(res)
      })()
    }
  }, [marzipanoViewer, location, panoTagId])

  const onClose = useCallback(() => {
    setPanoViewerSettings(null)
    setPanoFullScreen(false)
    setPanoTagId(null)
  }, [setPanoViewerSettings, setPanoTagId, setPanoFullScreen])

  return (
    <PanoramaStyle panoFullScreen={panoFullScreen}>
      <MarzipanoView ref={ref} />
      <PanoramaViewerControls {...{ onClose, panoImageDate, panoFullScreen }} />
    </PanoramaStyle>
  )
}

export default PanoramaViewer
