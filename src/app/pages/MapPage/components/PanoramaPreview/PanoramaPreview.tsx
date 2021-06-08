import { Link, perceivedLoading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import type { LatLngLiteral } from 'leaflet'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FetchPanoramaOptions } from '../../../../../api/panorama/thumbnail'
import { getPanoramaThumbnail } from '../../../../../api/panorama/thumbnail'
import { ForbiddenError } from '../../../../../shared/services/api/customError'
import PanoAlert from '../../../../components/PanoAlert/PanoAlert'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import useParam from '../../../../utils/useParam'
import {
  locationParam,
  mapLayersParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  zoomParam,
} from '../../query-params'
import { PANORAMA_THUMBNAIL } from '../../matomo-events'
import { PANO_LAYERS } from '../PanoramaViewer/PanoramaViewer'

export interface PanoramaPreviewProps extends FetchPanoramaOptions {
  location: LatLngLiteral
}

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px; /* Preview images have an aspect ratio of 5 : 2 */
  height: 160px;
`

const PreviewImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const PreviewText = styled.span`
  padding: ${themeSpacing(2, 2)};
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.6);
`

const PreviewSkeleton = styled.div`
  height: 160px;
  max-width: 400px;
  ${perceivedLoading()}
`

const PreviewMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${themeColor('tint', 'level3')};
`

const MIN_ZOOM_LEVEL_PANO_LAYERS = 11

// TODO: Link to panorama detail panel
// TODO: Wait for image to load and decode to prevent flickering.
// TODO: AfterBeta: Remove legacy link
const PanoramaPreview: FunctionComponent<PanoramaPreviewProps> = ({
  location,
  width,
  fov,
  horizon,
  aspect,
  radius,
  ...otherProps
}) => {
  const [activeLayers] = useParam(mapLayersParam)
  const [zoom] = useParam(zoomParam)
  const browserLocation = useLocation()
  const { trackEvent } = useMatomo()

  const result = usePromise(
    () =>
      getPanoramaThumbnail(location, {
        width,
        fov,
        horizon,
        aspect,
        radius,
      }),
    [location],
  )

  const activeLayersWithPanorama = useMemo(
    () => [...activeLayers, ...PANO_LAYERS],
    [activeLayers, PANO_LAYERS],
  )

  const { buildQueryString } = useBuildQueryString()

  if (isPending(result)) {
    return <PreviewSkeleton />
  }

  if (isRejected(result)) {
    if (result.reason instanceof ForbiddenError) {
      return <PanoAlert />
    }
    return <PreviewMessage>Kan panoramabeeld niet laden.</PreviewMessage>
  }

  if (!result.value) {
    return <PreviewMessage>Geen panoramabeeld beschikbaar.</PreviewMessage>
  }

  const to = {
    pathname: browserLocation.pathname,
    search: buildQueryString<any>([
      [panoPitchParam, panoPitchParam.initialValue],
      [panoFovParam, panoFovParam.initialValue],
      [panoHeadingParam, result?.value?.heading ?? panoHeadingParam.initialValue],
      [locationParam, location],
      [mapLayersParam, activeLayersWithPanorama],
      [zoomParam, zoom < MIN_ZOOM_LEVEL_PANO_LAYERS ? MIN_ZOOM_LEVEL_PANO_LAYERS : zoom],
    ]),
  }
  return (
    <PreviewContainer {...otherProps} data-testid="panoramaPreview">
      <Link
        as={RouterLink}
        to={to}
        onClick={() => {
          trackEvent(PANORAMA_THUMBNAIL)
        }}
      >
        <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
        <PreviewText>Bekijk panoramabeeld</PreviewText>
      </Link>
    </PreviewContainer>
  )
}

export default PanoramaPreview
