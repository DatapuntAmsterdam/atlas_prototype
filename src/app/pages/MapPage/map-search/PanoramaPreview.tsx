import { Link, perceivedLoading, themeColor, themeSpacing } from '@datapunt/asc-ui'
import { LatLngLiteral } from 'leaflet'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  FetchPanoramaOptions,
  getPanoramaThumbnail,
  PanoramaThumbnail,
} from '../../../../api/panorama/thumbnail'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'

export interface PanoramaPreviewProps extends FetchPanoramaOptions {
  location: LatLngLiteral
}

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
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

  return <PreviewContainer {...otherProps}>{renderResult(result)}</PreviewContainer>
}

function renderResult(result: PromiseResult<PanoramaThumbnail | null>) {
  if (result.status === PromiseStatus.Pending) {
    return <PreviewSkeleton />
  }

  if (result.status === PromiseStatus.Rejected) {
    return <PreviewMessage>Kon panoramabeeld niet laden.</PreviewMessage>
  }

  if (!result.value) {
    return <PreviewMessage>Geen panoramabeeld beschikbaar.</PreviewMessage>
  }

  return (
    <>
      <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
      <PreviewLink href="/" inList>
        Bekijk panoramabeeld
      </PreviewLink>
    </>
  )
}

export default PanoramaPreview
