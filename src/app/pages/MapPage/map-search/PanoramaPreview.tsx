import { Link, perceivedLoading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import LegacyLink from 'redux-first-router-link'
import styled from 'styled-components'
import {
  FetchPanoramaOptions,
  getPanoramaThumbnail,
  PanoramaThumbnail,
} from '../../../../api/panorama/thumbnail'
import { PANORAMA_CONFIG } from '../../../../panorama/services/panorama-api/panorama-api'
import { toPanoramaAndPreserveQuery } from '../../../../store/redux-first-router/actions'
import { getDetailLocation } from '../../../../store/redux-first-router/selectors'
import buildQueryString from '../../../utils/buildQueryString'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import { locationParam, panoParam } from '../query-params'

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
  const result = usePromise(
    useMemo(
      () =>
        getPanoramaThumbnail(location, {
          width,
          fov,
          horizon,
          aspect,
          radius,
        }),
      [location.lat, location.lng, width, fov, horizon, aspect, radius],
    ),
  )
  const legacyReference = useSelector(getDetailLocation)

  return (
    <PreviewContainer {...otherProps} data-testid="panorama-preview">
      {renderResult(result, location, legacyReference)}
    </PreviewContainer>
  )
}

function renderResult(
  result: PromiseResult<PanoramaThumbnail | null>,
  location: LatLngLiteral | null,
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
  const panoramaUrl = buildQueryString<any>([
    [panoParam, { heading: result.value.heading, pitch: 0, fov: PANORAMA_CONFIG.DEFAULT_FOV }],
    [locationParam, location],
  ])
  const link =
    window.location.pathname === '/kaart' || window.location.pathname === '/kaart/'
      ? `${window.location.pathname}?${panoramaUrl}`
      : toPanoramaAndPreserveQuery(result?.value?.id, result?.value?.heading, legacyReference)

  const linkComponent =
    window.location.pathname === '/kaart' || window.location.pathname === '/kaart/'
      ? RouterLink
      : LegacyLink
  return (
    <>
      <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
      {/*
      // @ts-ignore */}
      <PreviewLink forwardedAs={linkComponent} to={link} inList>
        Bekijk panoramabeeld
      </PreviewLink>
    </>
  )
}

export default PanoramaPreview
