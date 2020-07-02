import { MapPanelContext, MapPanelLegendButton, Zoom } from '@datapunt/arm-core'
import { Overlay } from '@datapunt/arm-core/lib/components/MapPanel/constants'
import { Spinner, ViewerContainer as ViewerContainerComponent } from '@datapunt/asc-ui'
import React, { useContext } from 'react'
import styled, { css } from 'styled-components'
import MapContext from '../MapContext'
import MapPreviewPanelContainer from '../MapPreviewPanelContainer'
import BaseLayerToggle from './BaseLayerToggle'
import DrawTool from './DrawTool'

type StyledViewerContainerProps = {
  left?: string
  height?: string
  ignoreTransition: boolean
}

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
  isLoading: boolean
}

const BottomLeftHolder = styled.div`
  display: flex;
`

const ViewerContainer: React.FC<Props> = ({
  currentOverlay,
  setCurrentOverlay,
  showDesktopVariant,
  setShowDrawTool,
  isLoading,
  showDrawTool,
  ...otherProps
}) => {
  const { detailUrl } = useContext(MapContext)
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
              {/* Todo: attach state to map reducer */}
              <BaseLayerToggle />
            </BottomLeftHolder>
          }
          bottomRight={isLoading ? <Spinner /> : null}
          bottomLeft={
            <MapPanelLegendButton {...{ showDesktopVariant, currentOverlay, setCurrentOverlay }} />
          }
          topRight={<DrawTool onToggle={setShowDrawTool} />}
        />
      ) : (
        <StyledViewerContainer
          {...otherProps}
          ignoreTransition={draggable}
          left={drawerPosition}
          topLeft={
            <MapPanelLegendButton {...{ showDesktopVariant, currentOverlay, setCurrentOverlay }} />
          }
          bottomRight={
            // TODO: make it possible to get and set the zoom level fromo the component
            <Zoom />
          }
          bottomLeft={
            <BottomLeftHolder>
              <BaseLayerToggle />
            </BottomLeftHolder>
          }
          topRight={
            <>
              <DrawTool
                isOpen={showDrawTool}
                onToggle={setShowDrawTool}
                setCurrentOverlay={setCurrentOverlay}
              />
              {detailUrl && <MapPreviewPanelContainer />}
            </>
          }
        />
      )}
    </>
  )
}

export default ViewerContainer
