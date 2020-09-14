import React from 'react'
import { Checkmark, ChevronDown, ExternalLink } from '@datapunt/asc-assets'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { ContextMenu, ContextMenuItem, Icon, themeSpacing } from '@datapunt/asc-ui'
import { ControlButton } from '@datapunt/arm-core'
import styled from 'styled-components'
import { getStreetViewUrl } from '../../../panorama/services/panorama-api/panorama-api'
import { PANO_LABELS } from '../../../panorama/ducks/constants'
import useParam from '../../utils/useParam'
import {
  locationParam,
  panoViewerSettingsParam,
  panoTagIdParam,
} from '../../pages/MapPage/query-params'
import { ReactComponent as Clock } from '../../../shared/assets/icons/Clock.svg'

export const getLabel = (id: string): string =>
  PANO_LABELS.find(({ id: labelId }) => labelId === id)?.label || PANO_LABELS[0].label

const StyledContextMenu = styled(ContextMenu)`
  z-index: 401; // on top of other buttons if opened

  & > * {
    max-height: 230px; // A bit arbitrary value, but this will prevent to overlap the menu on other UI elements
    overflow: auto;
  }
`

const CheckmarkIcon = styled(Icon)`
  padding-left: ${themeSpacing(3)};
`

const StyledContextMenuItem = styled(ContextMenuItem)`
  justify-content: flex-start;
  padding-left: ${themeSpacing(6)};
  & > span:first-of-type {
    padding-left: 0;
    margin: ${themeSpacing(1, 1, 1, -4)};
  }
`

const ContextMenuButton = styled(ControlButton)`
  border: none; // By default is has a border, but when used in Map context it should not have it
  height: 44px; // To match the other buttons
`

const PanoramaViewerMenu: React.FC = () => {
  const [location] = useParam(locationParam)
  const [panoViewerSettings] = useParam(panoViewerSettingsParam)
  const [panoTagId, setPanoTagId] = useParam(panoTagIdParam)
  const { trackEvent } = useMatomo()

  const handleOpenPanoramaExternal = () => {
    if (location) {
      const url = getStreetViewUrl([location.lat, location.lng], panoViewerSettings?.heading)

      trackEvent({
        category: 'panorama-set',
        action: 'panorama-set-google',
      })
      window.open(url, '_blank')
    }
  }

  return (
    <StyledContextMenu
      arrowIcon={<ChevronDown />}
      icon={
        <Icon padding={4} inline size={24}>
          <Clock />
        </Icon>
      }
      label={getLabel(panoTagId)}
      position="bottom"
      variant="blank"
      forwardedAs={ContextMenuButton}
    >
      {PANO_LABELS.map(({ id, label }, index) => (
        <StyledContextMenuItem
          key={id}
          divider={index === PANO_LABELS.length - 1}
          role="button"
          onClick={() => setPanoTagId(id)}
          icon={
            panoTagId === id ? (
              <CheckmarkIcon inline size={12}>
                <Checkmark />
              </CheckmarkIcon>
            ) : null
          }
        >
          {label}
        </StyledContextMenuItem>
      ))}
      <ContextMenuItem
        key="google-street-view"
        role="button"
        onClick={handleOpenPanoramaExternal}
        icon={
          <Icon padding={4} inline size={24}>
            <ExternalLink />
          </Icon>
        }
      >
        Google Street View
      </ContextMenuItem>
    </StyledContextMenu>
  )
}

export default PanoramaViewerMenu
