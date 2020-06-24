import React, { useEffect, useMemo, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { hooks } from '@datapunt/asc-ui'
import { TileLayer } from '@datapunt/react-maps'
import { NonTiledLayer } from '@datapunt/arm-nontiled'
import { BaseLayer, constants, Map, mapPanelComponents } from '@datapunt/arm-core'
import { PositionPerSnapPoint } from '@datapunt/arm-core/es/components/MapPanel/constants'
import GeoJSON from './Components/GeoJSON'
import MapContext from './MapContext'
import ViewerContainer from './Components/ViewerContainer'
import PointSearchMarker from './Components/PointSearchMarker'
import { Overlay, SnapPoint } from './types'
import PointSearchResults from './Components/PointSearchResults'
import MapLegend from './Components/MapLegend'
import handleMapClick from './utils/handleMapClick'
import MAP_CONFIG from '../../../map/services/map.config'
import DataSelectionProvider from './DataSelectionProvider'
import DrawContent from './Components/DrawContent'

const { MapPanel, MapPanelDrawer, MapPanelProvider } = mapPanelComponents
const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

const StyledMap = styled(Map)`
  width: 100%;
  height: 100%;
`

const MapView = styled.div`
  height: calc(100% - 50px);
  position: relative;
`

const GlobalStyle = createGlobalStyle`
  body {
    touch-action: none;
    overflow: hidden; // This will prevent the scrollBar on iOS due to navigation bar
  }
`

export const MAP_PANEL_SNAP_POSITIONS: PositionPerSnapPoint = {
  [SnapPoint.Full]: '480px',
  [SnapPoint.Halfway]: '480px',
  [SnapPoint.Closed]: '30px',
}

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDrawTool, setShowDrawTool] = useState(false)
  const [currentOverlay, setCurrentOverlay] = useState<Overlay>(Overlay.None)
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const {
    location,
    activeMapLayers,
    activeBaseLayer,
    mapLayers,
    overlays,
    getOverlays,
    setLocation,
    setDetailUrl,
    geometry,
  } = React.useContext(MapContext)

  const tmsLayers = overlays.filter((overlay) => overlay.type === MAP_CONFIG.MAP_LAYER_TYPES.TMS)
  const nonTmsLayers = overlays.filter((overlay) => overlay.type !== MAP_CONFIG.MAP_LAYER_TYPES.TMS)

  useEffect(() => {
    if (currentOverlay !== Overlay.Legend) {
      setCurrentOverlay(location || showDrawTool ? Overlay.Results : Overlay.None)
    }
  }, [location, showDrawTool, currentOverlay])

  const MapPanelOrDrawer = useMemo(() => (showDesktopVariant ? MapPanel : MapPanelDrawer), [
    showDesktopVariant,
  ])

  useEffect(() => {
    if (activeMapLayers?.length) {
      getOverlays()
    } else {
      getOverlays(activeMapLayers, mapLayers, {})
    }
  }, [activeMapLayers])

  return (
    <MapView>
      <GlobalStyle />
      <StyledMap
        options={{
          ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
          center: location || DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
        }}
        events={{
          loading: () => setIsLoading(true),
          load: () => setIsLoading(false),
        }}
      >
        <BaseLayer
          baseLayer={
            // TODO: Fix bug that prevents the client to set a value for the baseLayer
            activeBaseLayer
          }
        />
        {geometry && <GeoJSON geometry={geometry} />}
        {tmsLayers.map(({ url, overlayOptions: options, id }) => (
          <TileLayer
            key={id}
            url={url}
            options={options}
            events={{
              loading: () => setIsLoading(true),
              load: () => setIsLoading(false),
            }}
          />
        ))}
        {nonTmsLayers.map(({ url, overlayOptions: options, id }) => (
          <NonTiledLayer
            key={id}
            url={url}
            options={options}
            events={{
              loading: () => setIsLoading(true),
              load: () => setIsLoading(false),
            }}
          />
        ))}
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          variant={showDesktopVariant ? 'panel' : 'drawer'}
          initialPosition={SnapPoint.Closed}
          topOffset={50}
        >
          <DataSelectionProvider>
            <MapPanelOrDrawer>
              {!showDrawTool && (
                <PointSearchMarker
                  onClick={(e) => handleMapClick(e, setLocation, setDetailUrl, overlays)}
                  currentLatLng={location}
                />
              )}
              {currentOverlay === Overlay.Legend && (
                <MapLegend
                  stackOrder={3}
                  animate
                  onClose={() => {
                    setCurrentOverlay(location ? Overlay.Results : Overlay.None)
                  }}
                />
              )}
              {!showDrawTool && location && (
                <PointSearchResults
                  {...{
                    setLocation,
                    currentOverlay,
                    location,
                  }}
                />
              )}
              <DrawContent {...{ showDrawTool, currentOverlay, setShowDrawTool }} />
              <MapLegend />
            </MapPanelOrDrawer>
            <ViewerContainer
              {...{
                setCurrentOverlay,
                currentOverlay,
                showDesktopVariant,
                isLoading,
                setShowDrawTool,
                showDrawTool,
              }}
            />
          </DataSelectionProvider>
        </MapPanelProvider>
      </StyledMap>
    </MapView>
  )
}

export default MapPage
