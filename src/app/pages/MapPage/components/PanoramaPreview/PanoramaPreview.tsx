import { Link, perceivedLoading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import { FunctionComponent, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import usePromise, { PromiseStatus } from '@amsterdam/use-promise'
import { FetchPanoramaOptions, getPanoramaThumbnail } from '../../../../../api/panorama/thumbnail'
import { toPanoramaAndPreserveQuery } from '../../../../../store/redux-first-router/actions'
import { getDetailLocation } from '../../../../../store/redux-first-router/selectors'
import { PANO_LAYERS } from '../../../../components/PanoramaViewer/PanoramaViewer'
import pickLinkComponent from '../../../../utils/pickLinkComponent'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import {
  locationParam,
  mapLayersParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  zoomParam,
} from '../../query-params'
import useParam from '../../../../utils/useParam'
import { ForbiddenError } from '../../../../../shared/services/api/customError'
import PanoAlert from '../../../../components/PanoAlert/PanoAlert'

export interface PanoramaPreviewProps extends FetchPanoramaOptions {
  location: LatLngLiteral
}

export const PreviewContainer = styled.div`
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

const PreviewLink = styled(Link)`
  padding: ${themeSpacing(2, 2)};
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.6);
`

const PreviewSkeleton = styled.div`
  height: 100%;
  ${perceivedLoading()}
`

const PreviewMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${themeColor('tint', 'level3')};
`

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
  const browserLocation = useLocation()

  const activeLayersWithoutPano = useMemo(
    () => activeLayers.filter((id) => !PANO_LAYERS.includes(id)),
    [],
  )

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

  const newLayers = useMemo(() => [...activeLayersWithoutPano, ...PANO_LAYERS], [
    activeLayersWithoutPano,
  ])
  const legacyReference = useSelector(getDetailLocation)
  const { buildQueryString } = useBuildQueryString()
  if (result.status === PromiseStatus.Pending) {
    return <PreviewSkeleton />
  }

  if (result.status === PromiseStatus.Rejected) {
    if (result.error instanceof ForbiddenError) {
      return <PanoAlert />
    }
    return <PreviewMessage>Kan panoramabeeld niet laden.</PreviewMessage>
  }

  if (!result.value) {
    return <PreviewMessage>Geen panoramabeeld beschikbaar.</PreviewMessage>
  }

  const to = browserLocation.pathname.includes('kaart')
    ? {
        pathname: browserLocation.pathname,
        search: buildQueryString<any>([
          [panoPitchParam, panoPitchParam.initialValue],
          [panoFovParam, panoFovParam.initialValue],
          [panoHeadingParam, result?.value?.heading ?? panoHeadingParam.initialValue],
          [locationParam, location],
          // Zoom to level 11 when opening the PanoramaViewer, to show the panorama map layers
          [mapLayersParam, newLayers],
          [zoomParam, 11],
        ]),
      }
    : // eslint-disable-next-line camelcase
      toPanoramaAndPreserveQuery(result?.value?.pano_id, result?.value?.heading, legacyReference)

  return (
    <PreviewContainer {...otherProps} data-testid="panoramaPreview">
      <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
      {/*
      // @ts-ignore */}
      <PreviewLink forwardedAs={pickLinkComponent(to)} to={to} inList>
        Bekijk panoramabeeld
      </PreviewLink>
    </PreviewContainer>
  )
}

export default PanoramaPreview
