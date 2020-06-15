import { Link, perceivedLoading, themeColor, themeSpacing } from '@datapunt/asc-ui'
import { LatLng } from 'leaflet'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { FetchPanoramaOptions, getPanoramaThumbnail } from '../../../../api/panorama/thumbnail'
import usePromise, { PromiseStatus } from '../../../utils/usePromise'

export interface PanoramaPreviewProps extends FetchPanoramaOptions {
  location: LatLng
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
      [location, width, fov, horizon, aspect, radius],
    ),
  )

  if (result.status === PromiseStatus.Pending) {
    return renderSkeleton()
  }

  if (result.status === PromiseStatus.Rejected) {
    return renderMessage('Kon panoramabeeld niet laden.')
  }

  if (!result.value) {
    return renderMessage('Geen panoramabeeld beschikbaar.')
  }

  return (
    <PreviewContainer>
      <PreviewImage src={result.value.url} alt="Voorvertoning van panoramabeeld" />
      <PreviewLink href="/" variant="with-chevron">
        Bekijk panoramabeeld
      </PreviewLink>
    </PreviewContainer>
  )
}

function renderSkeleton() {
  return (
    <PreviewContainer>
      <PreviewSkeleton />
    </PreviewContainer>
  )
}

function renderMessage(message: string) {
  return (
    <PreviewContainer>
      <PreviewMessage>{message}</PreviewMessage>
    </PreviewContainer>
  )
}

export default PanoramaPreview
