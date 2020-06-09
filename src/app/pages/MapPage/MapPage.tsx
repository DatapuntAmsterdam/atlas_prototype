import React, { useEffect, useMemo, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { hooks } from '@datapunt/asc-ui'
import { TileLayer } from '@datapunt/react-maps'
// import { NonTiledLayer } from '@datapunt/arm-nontiled'
import { BaseLayer, constants, Map, mapPanelComponents, useStateRef } from '@datapunt/arm-core'
import { MarkerClusterGroup } from '@datapunt/arm-cluster'
import { PositionPerSnapPoint } from '@datapunt/arm-core/es/components/MapPanel/constants'
import GeoJSON from './Components/GeoJSON'
import MapContext from './MapContext'
import ViewerContainer from './Components/ViewerContainer'
import PointSearchMarker from './Components/PointSearchMarker'
import { MarkerGroup, Overlay, SnapPoint } from './types'
import PointSearchResults from './Components/PointSearchResults'
import MapLegend from './Components/MapLegend'
import handleMapClick from './utils/handleMapClick'
import MAP_CONFIG from '../../../map/services/map.config'

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
  [SnapPoint.Full]: '40%',
  [SnapPoint.Halfway]: '40%',
  [SnapPoint.Closed]: '30px',
}

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDrawTool, setShowDrawTool] = useState(true)
  const [markerGroups, setMarkerGroups, markerGroupsRef] = useStateRef<MarkerGroup[]>([])
  const [currentOverlay, setCurrentOverlay] = useState<Overlay>(Overlay.None)
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const {
    location,
    activeMapLayers,
    mapLayers,
    overlays,
    getOverlays,
    setLocation,
    setDetailUrl,
    geometry,
  } = React.useContext(MapContext)

  const tmsLayers = overlays.filter((overlay) => overlay.type === MAP_CONFIG.MAP_LAYER_TYPES.TMS)
  // Todo: uncomment when loading nontiled lib issue in arm-nontiled is fixed
  // const nonTmsLayers = overlays.filter((overlay) => overlay.type !== MAP_CONFIG.MAP_LAYER_TYPES.TMS)

  useEffect(() => {
    if (!location) {
      setCurrentOverlay(Overlay.None)
    } else {
      setCurrentOverlay(Overlay.Results)
    }
  }, [location])

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
        {showDrawTool &&
          markerGroups.map(({ markers, id }) => <MarkerClusterGroup key={id} markers={markers} />)}
        <BaseLayer />
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
        {/* Todo: uncomment when loading nontiled lib issue in arm-nontiled is fixed */}
        {/* {nonTmsLayers.map(({ url, overlayOptions: options, id }) => ( */}
        {/*   <NonTiledLayer */}
        {/*     key={id} */}
        {/*     url={url} */}
        {/*     options={options} */}
        {/*     events={{ */}
        {/*       loading: () => setIsLoading(true), */}
        {/*       load: () => setIsLoading(false), */}
        {/*     }} */}
        {/*   /> */}
        {/* ))} */}
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          variant={showDesktopVariant ? 'panel' : 'drawer'}
          initialPosition={SnapPoint.Closed}
          topOffset={50}
        >
          <MapPanelOrDrawer>
            {!showDrawTool && (
              <PointSearchMarker
                onClick={(e) => handleMapClick(e, setLocation, setDetailUrl, overlays)}
                currentLatLng={location}
              />
            )}
            {currentOverlay === Overlay.Legend && (
              <MapLegend
                stackOrder={2}
                animate
                onClose={() => {
                  setCurrentOverlay(location ? Overlay.Results : Overlay.None)
                }}
              />
            )}
            {location && (
              <PointSearchResults
                {...{
                  setLocation,
                  currentOverlay,
                  location,
                }}
              />
            )}
            <MapLegend />
          </MapPanelOrDrawer>
          <ViewerContainer
            {...{
              setCurrentOverlay,
              currentOverlay,
              showDesktopVariant,
              markerGroupsRef,
              isLoading,
              setShowDrawTool,
              setMarkerGroups,
            }}
          />
        </MapPanelProvider>
      </StyledMap>
    </MapView>
  )
}

export default MapPage
