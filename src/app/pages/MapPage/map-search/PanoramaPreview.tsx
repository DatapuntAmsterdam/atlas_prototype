import { Link, perceivedLoading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import LegacyLink from 'redux-first-router-link'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  FetchPanoramaOptions,
  getPanoramaThumbnail,
  PanoramaThumbnail,
} from '../../../../api/panorama/thumbnail'
import { PANORAMA_CONFIG } from '../../../../panorama/services/panorama-api/panorama-api'
import buildQueryString from '../../../utils/buildQueryString'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import { locationParam, mapLayersParam, panoParam, zoomParam } from '../query-params'
import useParam from '../../../utils/useParam'
import { PANO_LAYERS } from '../../../components/PanoramaViewer/PanoramaViewer'
import { toPanoramaAndPreserveQuery } from '../../../../store/redux-first-router/actions'
import { getDetailLocation } from '../../../../store/redux-first-router/selectors'

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
const PanoramaPreview: React.FC<PanoramaPreviewProps> = ({
  location,
  width,
  fov,
  horizon,
  aspect,
  radius,
  ...otherProps
}) => {
  const [activeLayers] = useParam(mapLayersParam)
  const activeLayersWithoutPano = useMemo(
    () => activeLayers.filter((id) => !PANO_LAYERS.includes(id)),
    [],
  )

  const newLayers = [...activeLayersWithoutPano, ...PANO_LAYERS]

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
  const legacyReference = useSelector(getDetailLocation)

  return (
    <PreviewContainer {...otherProps} data-testid="panorama-preview">
      {renderResult(result, newLayers, location, legacyReference)}
    </PreviewContainer>
  )
}

function renderResult(
  result: PromiseResult<PanoramaThumbnail | null>,
  newLayers: string[],
  location: LatLngLiteral,
  legacyReference: any,
) {
  if (result.status === PromiseStatus.Pending) {
    return <PreviewSkeleton />
  }

  if (result.status === PromiseStatus.Rejected) {
    return <PreviewMessage>Kon panoramabeeld niet laden.</PreviewMessage>
  }

  if (!result.value) {
    return <PreviewMessage>Geen panoramabeeld beschikbaar.</PreviewMessage>
  }

  const to = window.location.pathname.includes('kaart')
    ? {
        pathname: window.location.pathname,
        search: result?.value?.heading
          ? buildQueryString<any>([
              [
                panoParam,
                {
                  heading: result?.value?.heading,
                  pitch: 0,
                  fov: PANORAMA_CONFIG.DEFAULT_FOV,
                },
              ],
              [locationParam, location],
              // Zoom to level 11 when opening the PanoramaViewer, to show the panorama map layers
              [mapLayersParam, newLayers],
              [zoomParam, 11],
            ])
          : '',
      }
    : toPanoramaAndPreserveQuery(result?.value?.id, result?.value?.heading, legacyReference)
  const linkComponent = window.location.pathname.includes('kaart') ? RouterLink : LegacyLink

  return (
    <>
      <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
      {/*
      // @ts-ignore */}
      <PreviewLink forwardedAs={linkComponent} to={to} inList>
        Bekijk panoramabeeld
      </PreviewLink>
    </>
  )
}

export default PanoramaPreview
