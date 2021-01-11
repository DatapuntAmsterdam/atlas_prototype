import { MapPanelContext, MapPanelLegendButton, Zoom } from '@amsterdam/arm-core'
import { Overlay } from '@amsterdam/arm-core/lib/components/MapPanel/constants'
import { Spinner, ViewerContainer as ViewerContainerComponent } from '@amsterdam/asc-ui'
import { FunctionComponent, useContext } from 'react'
import { DrawToolOpenButton } from '@amsterdam/arm-draw'
import styled, { css } from 'styled-components'
import BaseLayerToggle from './controls/BaseLayerToggle'
import DrawTool from './draw/DrawTool'
import MapContext from './MapContext'

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

export interface MapControlsProps {
  currentOverlay: Overlay
  setCurrentOverlay: (overlay: Overlay) => void
  showDesktopVariant: boolean
  isLoading: boolean
  panoActive: boolean
}

const BottomLeftHolder = styled.div`
  display: flex;
`

const MapControls: FunctionComponent<MapControlsProps> = ({
  currentOverlay,
  setCurrentOverlay,
  showDesktopVariant,
  isLoading,
  panoActive,
  ...otherProps
}) => {
  const { showDrawTool, setShowDrawTool } = useContext(MapContext)
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
          topRight={
            !panoActive && (
              <>
                {!showDrawTool && (
                  <DrawToolOpenButton
                    data-testid="drawtoolOpenButton"
                    onClick={() => setShowDrawTool(true)}
                  />
                )}
                {showDrawTool && <DrawTool setCurrentOverlay={setCurrentOverlay} />}
              </>
            )
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
            !panoActive && (
              <>
                {!showDrawTool && (
                  <DrawToolOpenButton
                    data-testid="drawtoolOpenButton"
                    onClick={() => {
                      setShowDrawTool(true)
                    }}
                  />
                )}
                {showDrawTool && <DrawTool setCurrentOverlay={setCurrentOverlay} />}
              </>
            )
          }
        />
      )}
    </>
  )
}

export default MapControls
