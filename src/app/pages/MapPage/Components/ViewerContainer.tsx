import React, { useContext } from 'react'
import {
  ViewerContainer as ViewerContainerComponent,
  Spinner,
  themeSpacing,
} from '@datapunt/asc-ui'
import styled, { css } from 'styled-components'
import { Overlay } from '@datapunt/arm-core/lib/components/MapPanel/constants'
import { BaseLayerToggle, Zoom, mapPanelComponents } from '@datapunt/arm-core'
import MapPanelContainer from '../../../../map/containers/panel/MapPanelContainer'
import MapPreviewPanelContainer from '../../../../map/containers/preview-panel/MapPreviewPanelContainer'
import DrawTool from './DrawTool'
import { MarkerGroup } from '../types'

type StyledViewerContainerProps = {
  left?: string
  height?: string
  ignoreTransition: boolean
}

const { MapPanelLegendButton, MapPanelContext } = mapPanelComponents

const StyledViewerContainer = styled(ViewerContainerComponent).attrs<StyledViewerContainerProps>(
  ({ height, left }) => ({
    style: {
      height,
      left,
    },
  }),
)<StyledViewerContainerProps>`
  z-index: 400;
  ${({ ignoreTransition }) =>
    !ignoreTransition &&
    css`
      transition: height 0.3s ease-in-out;
    `}
`

type Props = {
  currentOverlay: Overlay
  setCurrentOverlay: (overlay: Overlay) => void
  showDesktopVariant: boolean
  setShowDrawTool: (arg: boolean) => void
  setMarkerGroups: (arg: MarkerGroup[]) => void
  markerGroupsRef: React.RefObject<any>
  isLoading: boolean
}

const BottomLeftHolder = styled.div`
  display: flex;
`

// This can be deleted once we use the new MapDrawer / MapPanel
const MapPanelContainerWrapper = styled.div`
  bottom: 20px;
  margin-right: ${themeSpacing(2)};

  & > section {
    left: 0;
    bottom: 0;
    position: relative;
    max-height: 80vh;
  }
`

const ViewerContainer: React.FC<Props> = ({
  currentOverlay,
  setCurrentOverlay,
  showDesktopVariant,
  setShowDrawTool,
  setMarkerGroups,
  markerGroupsRef,
  isLoading,
  ...otherProps
}) => {
  const { drawerPosition, draggable } = useContext(MapPanelContext)
  const height = parseInt(drawerPosition, 10) < window.innerHeight / 2 ? '50%' : drawerPosition

  return (
    <>
      {!showDesktopVariant ? (
        <StyledViewerContainer
          {...otherProps}
          ignoreTransition={draggable}
          height={height}
          topLeft={
            <BottomLeftHolder>
              <MapPanelContainerWrapper>
                <MapPanelContainer />
              </MapPanelContainerWrapper>
              {/* Todo: attach state to map reducer */}
              <BaseLayerToggle />
            </BottomLeftHolder>
          }
          bottomRight={isLoading ? <Spinner /> : null}
          bottomLeft={
            <MapPanelLegendButton {...{ showDesktopVariant, currentOverlay, setCurrentOverlay }} />
          }
          topRight={
            <>
              <DrawTool
                onToggle={setShowDrawTool}
                setMarkerGroups={setMarkerGroups}
                markerGroupsRef={markerGroupsRef}
              />
            </>
          }
        />
      ) : (
        <StyledViewerContainer
          {...otherProps}
          ignoreTransition={draggable}
          left={drawerPosition}
          topLeft={
            <MapPanelLegendButton {...{ showDesktopVariant, currentOverlay, setCurrentOverlay }} />
          }
          bottomRight={<Zoom />}
          bottomLeft={
            <BottomLeftHolder>
              <MapPanelContainerWrapper>
                <MapPanelContainer />
              </MapPanelContainerWrapper>
              <BaseLayerToggle />
            </BottomLeftHolder>
          }
          topRight={
            <>
              <DrawTool
                onToggle={setShowDrawTool}
                setMarkerGroups={setMarkerGroups}
                markerGroupsRef={markerGroupsRef}
              />
              <MapPreviewPanelContainer />
            </>
          }
        />
      )}
    </>
  )
}

export default ViewerContainer
