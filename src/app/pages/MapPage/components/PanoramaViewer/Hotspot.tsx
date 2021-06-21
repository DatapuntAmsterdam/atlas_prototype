import { srOnlyStyle } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'

interface HotSpotProps {
  year: string
  size: number
  angle: number
}

const HotspotImage = styled.div<{ year: string }>`
  background-size: cover;
  transform: scale(1);

  ${({ year }) => css`
    background-image: url('/assets/images/hotspots/${year}.svg');
  `}
`

const hotspotAnimation = keyframes`
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.15);
  }
`

export const HotspotButton = styled.button`
  background: transparent;
  cursor: pointer;
  margin: 0 -20px;
  outline: none;
  padding: 0 20px;

  &:hover {
    animation: ${hotspotAnimation} 100ms linear;
    transform: scale(1.15);
  }
`

const SrOnlySpan = styled.span`
  ${srOnlyStyle}
`

const Hotspot: FunctionComponent<HotSpotProps> = ({ year, size, angle }) => (
  <HotspotButton className="panorama-hotspot" type="button" tabIndex={-1}>
    <HotspotImage
      data-testid="hotspot"
      year={year}
      style={{ width: `${size}px`, height: `${size}px`, transform: `rotateX(${angle}deg)` }}
    />

    <SrOnlySpan>Navigeer naar deze locatie</SrOnlySpan>
  </HotspotButton>
)

export default Hotspot
