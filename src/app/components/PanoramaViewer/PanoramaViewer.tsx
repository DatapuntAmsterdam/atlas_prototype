import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PANO_LABELS } from '../../../panorama/ducks/constants'
import { loadScene } from '../../../panorama/services/marzipano/marzipano'
import {
  getImageDataById,
  getImageDataByLocation,
} from '../../../panorama/services/panorama-api/panorama-api'
import {
  locationParam,
  mapLayersParam,
  panoFullScreenParam,
  panoParam,
  panoTagParam,
} from '../../pages/MapPage/query-params'
import useBuildQueryString from '../../utils/useBuildQueryString'
import useMarzipano from '../../utils/useMarzipano'
import useParam from '../../utils/useParam'
import PanoramaViewerControls from './PanoramaViewerControls'

const MarzipanoView = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const PanoramaStyle = styled.div<{ panoFullScreen: boolean }>`
  height: ${({ panoFullScreen }) => (panoFullScreen ? '100%' : '50%')};
  position: relative;
  order: -1; // Put the PanoramaViewer above the Map
`

// Todo: get ID's from request
export const PANO_LAYERS = [
  'pano-pano2020bi',
  'pano-pano2019bi',
  'pano-pano2018bi',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

const PanoramaViewer: FunctionComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [panoImageDate, setPanoImageDate] = useState<string>()
  const [pano, setPano] = useParam(panoParam)
  const [panoTag, setPanoTag] = useParam(panoTagParam)
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const [location, setLocation] = useParam(locationParam)
  const [activeLayers] = useParam(mapLayersParam)
  const { marzipanoViewer, currentMarzipanoView } = useMarzipano(ref)
  const browserLocation = useLocation()
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()

  const onClickHotspot = useCallback(
    async (id: string) => {
      const newPanos = await getImageDataById(
        id,
        PANO_LABELS.find(({ id: labelId }) => labelId === panoTag)?.tags,
      )
      setLocation({ lat: newPanos.location[0], lng: newPanos.location[1] })
    },
    [setLocation, panoTag],
  )

  const fetchPanoramaImage = useCallback(
    (res) => {
      if (pano) {
        setPanoImageDate(res.date)
        loadScene(
          marzipanoViewer,
          onClickHotspot,
          res.image,
          pano.heading,
          pano.pitch,
          pano.fov,
          res.hotspots,
        )
      }
    },
    [pano, setPanoImageDate, marzipanoViewer, onClickHotspot],
  )

  // Update the URL queries when the view changes
  useEffect(() => {
    if (currentMarzipanoView) {
      setPano(currentMarzipanoView, 'replace')
    }
  }, [currentMarzipanoView])

  // Reset the FOV when toggling fullscreen.
  // This will solve the issue that when the viewer is on full screen, it's zoomed in too much
  useEffect(() => {
    if (marzipanoViewer) {
      marzipanoViewer.updateSize() // Updates the stage size to fill the containing element.
      if (pano && marzipanoViewer.view()) {
        setTimeout(() => {
          marzipanoViewer.view().setFov(100) // some high number, the viewer itself will set the max FOV
        }, 0)
      }
    }
  }, [marzipanoViewer, panoFullScreen])

  // Fetch image when the location changes
  useEffect(() => {
    if (marzipanoViewer && location && pano) {
      ;(async () => {
        const res = await getImageDataByLocation(
          [location.lat, location.lng],
          PANO_LABELS.find(({ id }) => id === panoTag)?.tags,
        )
        fetchPanoramaImage(res)
      })()
    }
  }, [marzipanoViewer, location, panoTag])

  const activeLayersWithoutPano = useMemo(
    () => activeLayers.filter((id) => !PANO_LAYERS.includes(id)),
    [],
  )

  const onClose = useCallback(() => {
    history.push({
      pathname: browserLocation.pathname,
      search: buildQueryString(
        [[mapLayersParam, activeLayersWithoutPano]],
        [panoParam, panoTagParam, panoFullScreenParam],
      ),
    })
  }, [setPano, setPanoTag, setPanoFullScreen])

  return (
    <PanoramaStyle panoFullScreen={panoFullScreen}>
      <MarzipanoView ref={ref} />
      <PanoramaViewerControls
        panoImageDate={panoImageDate}
        panoFullScreen={panoFullScreen}
        onClose={onClose}
      />
    </PanoramaStyle>
  )
}

export default PanoramaViewer
