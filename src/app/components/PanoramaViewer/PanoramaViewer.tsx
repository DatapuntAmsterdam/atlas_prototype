import { FunctionComponent, useCallback, useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { PANO_LABELS } from '../../../panorama/ducks/constants'
import { loadScene } from '../../../panorama/services/marzipano/marzipano'
import {
  getImageDataById,
  getImageDataByLocation,
} from '../../../panorama/services/panorama-api/panorama-api'
import {
  locationParam,
  panoFovParam,
  panoFullScreenParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
} from '../../pages/MapPage/query-params'
import useMarzipano from '../../utils/useMarzipano'
import useParam from '../../utils/useParam'
import MapContext from '../../pages/MapPage/MapContext'

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

export const PANO_LAYERS = [
  'pano-pano2020bi',
  'pano-pano2019bi',
  'pano-pano2018bi',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

const PanoramaViewer: FunctionComponent = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { setPanoImageDate } = useContext(MapContext)
  const [panoPitch, setPanoPitch] = useParam(panoPitchParam)
  const [panoHeading, setPanoHeading] = useParam(panoHeadingParam)
  const [panoFov, setPanoFov] = useParam(panoFovParam)
  const [panoTag] = useParam(panoTagParam)
  const [panoFullScreen] = useParam(panoFullScreenParam)
  const [location, setLocation] = useParam(locationParam)
  const { marzipanoViewer, currentMarzipanoView } = useMarzipano(ref)

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
      if (panoPitch && panoHeading) {
        setPanoImageDate(res.date)
        loadScene(
          marzipanoViewer,
          onClickHotspot,
          res.image,
          panoHeading,
          panoPitch || panoPitchParam.initialValue,
          panoFov || panoFovParam.initialValue,
          res.hotspots,
        )
      }
    },
    [panoPitch, panoHeading, setPanoImageDate, marzipanoViewer, onClickHotspot],
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

  // Fetch image when the location changes
  useEffect(() => {
    if (marzipanoViewer && location && panoHeading) {
      ;(() => {
        // @ts-ignore
        getImageDataByLocation(
          [location.lat, location.lng],
          PANO_LABELS.find(({ id }) => id === panoTag)?.tags || [],
        )
          .then((res) => {
            fetchPanoramaImage(res)
          })
          .catch(() => {})
      })()
    }
  }, [marzipanoViewer, location, panoTag])

  return (
    <PanoramaStyle panoFullScreen={panoFullScreen}>
      <MarzipanoView ref={ref} />
    </PanoramaStyle>
  )
}

export default PanoramaViewer
