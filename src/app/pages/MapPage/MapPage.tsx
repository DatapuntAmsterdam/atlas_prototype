import { constants, Map as MapComponent, MapPanelProvider, useStateRef } from '@amsterdam/arm-core'
import { PositionPerSnapPoint } from '@amsterdam/arm-core/es/components/MapPanel/constants'
import { hooks } from '@amsterdam/asc-ui'
import L from 'leaflet'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import PanoramaViewer from '../../components/PanoramaViewer/PanoramaViewer'
import useParam from '../../utils/useParam'
import DataSelectionProvider from './draw/DataSelectionProvider'
import LeafletLayers from './LeafletLayers'
import MapContext from './MapContext'
import MapControls from './MapControls'
import MapMarkers from './MapMarkers'
import MapPanelContent from './MapPanelContent'
import { centerParam, mapLayersParam, panoParam, zoomParam } from './query-params'
import { Overlay, SnapPoint } from './types'

const MapView = styled.div`
  height: 100%;
  position: relative;
  z-index: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const GlobalStyle = createGlobalStyle<{
  panoActive?: boolean
  panoFullScreen: boolean
}>`
  body {
    touch-action: none;
    overflow: hidden; // This will prevent the scrollBar on iOS due to navigation bar
  }

  // Need to set the styled globally and not as a Styled Component as this will cause problems with leaflet calculating the map canvas / dimensions
  .leaflet-container {
    position: sticky !important;
    height: ${({ panoActive }) => (panoActive ? '50%' : '100%')};
    ${({ panoFullScreen }) =>
      panoFullScreen &&
      css`
        display: none;
      `}
  }
`

export const MAP_PANEL_SNAP_POSITIONS: PositionPerSnapPoint = {
  [SnapPoint.Full]: '480px',
  [SnapPoint.Halfway]: '480px',
  [SnapPoint.Closed]: '30px',
}

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

// Todo: get ID's from request
const PANO_LAYERS = [
  'pano-pano2020bi',
  'pano-pano2019bi',
  'pano-pano2018bi',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentOverlay, setCurrentOverlay] = useState(Overlay.None)
  const { showDrawTool, panoFullScreen } = useContext(MapContext)
  const [mapInstance, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const [pano] = useParam(panoParam)
  const [activeLayers, setActiveLayers] = useParam(mapLayersParam)
  // TODO: Import 'useMatchMedia' directly once this issue has been resolved: https://github.com/Amsterdam/amsterdam-styled-components/issues/1120
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })

  const panoActive = !!pano

  // This is necessary to call, because we resize the map dynamically
  // https://leafletjs.com/reference-1.7.1.html#map-invalidatesize
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }, [panoFullScreen, pano, mapInstanceRef])

  // Zoom to level 11 when opening the PanoramaViewer, to show the panorama map layers
  useEffect(() => {
    const activeLayersWithoutPano = activeLayers.filter((id) => !PANO_LAYERS.includes(id))
    if (panoActive && mapInstance) {
      mapInstance.setZoom(11)

      setActiveLayers([...activeLayersWithoutPano, ...PANO_LAYERS])
    } else {
      setActiveLayers([...activeLayersWithoutPano])
    }
  }, [panoActive, setActiveLayers, mapInstance])

  return (
    <MapView>
      <GlobalStyle {...{ panoActive, panoFullScreen }} />
      <MapComponent
        setInstance={setMapInstance}
        options={{
          ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
          zoom: zoom ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom,
          center: center ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
        }}
        events={{
          zoomend: useCallback(() => {
            if (mapInstanceRef?.current) {
              setZoom(mapInstanceRef.current.getZoom(), 'replace')
            }
          }, [mapInstanceRef, setZoom]),
          moveend: useCallback(() => {
            if (mapInstanceRef?.current) {
              setCenter(mapInstanceRef.current.getCenter(), 'replace')
            }
          }, [mapInstanceRef, setCenter]),
          loading: useCallback(() => {
            setIsLoading(true)
          }, [setIsLoading]),
          load: useCallback(() => {
            setIsLoading(false)
          }, [setIsLoading]),
        }}
      >
        <DataSelectionProvider>
          <LeafletLayers />
          <MapPanelProvider
            mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
            variant={showDesktopVariant ? 'panel' : 'drawer'}
            initialPosition={SnapPoint.Closed}
            topOffset={50}
          >
            {panoActive && <PanoramaViewer />}
            <MapMarkers panoActive={panoActive} />
            {!panoFullScreen ? (
              <MapPanelContent {...{ setCurrentOverlay, currentOverlay }} />
            ) : null}
            {!panoFullScreen ? (
              <MapControls
                {...{
                  setCurrentOverlay,
                  currentOverlay,
                  showDesktopVariant,
                  isLoading,
                  showDrawTool,
                  panoActive,
                }}
              />
            ) : null}
          </MapPanelProvider>
        </DataSelectionProvider>
      </MapComponent>
    </MapView>
  )
}

export default MapPage
