import { useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import usePromise, { isFulfilled, isPending } from '@amsterdam/use-promise'
import type { FunctionComponent } from 'react'
import { PANO_LABELS } from '../../../../../panorama/ducks/constants'
import { loadScene } from '../../../../../panorama/services/marzipano/marzipano'
import {
  getImageDataById,
  getImageDataByLocation,
} from '../../../../../panorama/services/panorama-api/panorama-api'
import {
  locationParam,
  panoFovParam,
  panoFullScreenParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
} from '../../query-params'
import useMarzipano from '../../../../utils/useMarzipano'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import { HotspotButton } from '../../../../../panorama/components/Hotspot/Hotspot'

const MarzipanoView = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const PanoramaStyle = styled.div<{ panoFullScreen: boolean; loading: boolean }>`
  height: ${({ panoFullScreen }) => (panoFullScreen ? '100%' : '50%')};
  position: relative;
  order: -1; // Put the PanoramaViewer above the Map
  ${({ loading }) =>
    loading &&
    css`
      ${HotspotButton},
      canvas + div {
        cursor: progress !important;
      }
    `}
`

export const PANO_LAYERS = [
  'pano-pano2020bi',
  'pano-pano2019bi',
  'pano-pano2018bi',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

const PanoramaViewer: FunctionComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { setPanoImageDate, setLoading, loading } = useMapContext()
  const [panoPitch, setPanoPitch] = useParam(panoPitchParam)
  const [panoHeading, setPanoHeading] = useParam(panoHeadingParam)
  const [panoFov, setPanoFov] = useParam(panoFovParam)
  const [panoTag] = useParam(panoTagParam)
  const [panoFullScreen] = useParam(panoFullScreenParam)
  const [location, setLocation] = useParam(locationParam)
  const { marzipanoViewer, currentMarzipanoView } = useMarzipano(ref)
  const [hotspotId, setHotspotId] = useState(null)

  const hotspotResult = usePromise(async () => {
    if (!hotspotId) {
      return null
    }
    return getImageDataById(
      hotspotId,
      PANO_LABELS.find(({ id: labelId }) => labelId === panoTag)?.tags,
    )
  }, [hotspotId])

  const imageDataResult = usePromise(async () => {
    if (!location) {
      return null
    }
    return getImageDataByLocation(
      [location.lat, location.lng],
      PANO_LABELS.find(({ id }) => id === panoTag)?.tags || [],
    )
  }, [location, panoTag, marzipanoViewer])

  useEffect(() => {
    setLoading(isPending(hotspotResult))

    if (isFulfilled(hotspotResult) && hotspotResult.value !== null) {
      setLocation({ lat: hotspotResult.value.location[0], lng: hotspotResult.value.location[1] })
    }
  }, [hotspotResult])

  const fetchPanoramaImage = useCallback(
    (res) => {
      if (panoPitch && panoHeading) {
        setPanoImageDate(res.date)
        loadScene(
          marzipanoViewer,
          setHotspotId,
          res.image,
          panoHeading,
          panoPitch || panoPitchParam.initialValue,
          panoFov || panoFovParam.initialValue,
          res.hotspots,
        )
      }
    },
    [panoPitch, panoHeading, setPanoImageDate, marzipanoViewer, setHotspotId],
  )

  // Update the URL queries when the view changes
  useEffect(() => {
    if (currentMarzipanoView) {
      setPanoHeading(currentMarzipanoView.heading, 'replace')
      setPanoPitch(currentMarzipanoView.pitch, 'replace')
      setPanoFov(currentMarzipanoView.fov, 'replace')
    }
  }, [currentMarzipanoView])

  // Reset the FOV when toggling fullscreen.
  // This will solve the issue that when the viewer is on full screen, it's zoomed in too much
  useEffect(() => {
    if (marzipanoViewer) {
      marzipanoViewer.updateSize() // Updates the stage size to fill the containing element.
      if (panoHeading && marzipanoViewer.view()) {
        setTimeout(() => {
          marzipanoViewer.view().setFov(100) // some high number, the viewer itself will set the max FOV
        }, 0)
      }
    }
  }, [marzipanoViewer, panoFullScreen])

  useEffect(() => {
    setLoading(isPending(imageDataResult))

    if (isFulfilled(imageDataResult) && imageDataResult.value !== null) {
      fetchPanoramaImage(imageDataResult.value)
    }
  }, [imageDataResult])

  return (
    <PanoramaStyle loading={loading} panoFullScreen={panoFullScreen}>
      <MarzipanoView ref={ref} />
    </PanoramaStyle>
  )
}

export default PanoramaViewer
