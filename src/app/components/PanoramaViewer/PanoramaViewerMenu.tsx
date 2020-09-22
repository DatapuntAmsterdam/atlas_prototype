import { ControlButton } from '@amsterdam/arm-core'
import { Checkmark, ChevronDown, ExternalLink } from '@amsterdam/asc-assets'
import { ContextMenu, ContextMenuItem, Icon, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React from 'react'
import styled from 'styled-components'
import { PANO_LABELS } from '../../../panorama/ducks/constants'
import { getStreetViewUrl } from '../../../panorama/services/panorama-api/panorama-api'
import { ReactComponent as Clock } from '../../../shared/assets/icons/Clock.svg'
import { locationParam, panoParam, panoTagParam } from '../../pages/MapPage/query-params'
import useParam from '../../utils/useParam'

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
  const [pano] = useParam(panoParam)
  const [panoTag, setPanoTag] = useParam(panoTagParam)
  const { trackEvent } = useMatomo()

  const handleOpenPanoramaExternal = () => {
    if (location) {
      const url = getStreetViewUrl([location.lat, location.lng], pano?.heading)

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
      label={getLabel(panoTag)}
      position="bottom"
      variant="blank"
      forwardedAs={ContextMenuButton}
    >
      {PANO_LABELS.map(({ id, label }, index) => (
        <StyledContextMenuItem
          key={id}
          divider={index === PANO_LABELS.length - 1}
          role="button"
          onClick={() => setPanoTag(id)}
          icon={
            panoTag === id ? (
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
