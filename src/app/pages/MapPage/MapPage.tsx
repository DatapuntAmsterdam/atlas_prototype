import { constants, Map as MapComponent, MapPanelProvider, useStateRef } from '@datapunt/arm-core'
import { PositionPerSnapPoint } from '@datapunt/arm-core/es/components/MapPanel/constants'
import { Alert, Heading, hooks, Link } from '@datapunt/asc-ui'
import React, { useContext, useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled, { createGlobalStyle } from 'styled-components'
import L from 'leaflet'
import { toMap } from '../../../store/redux-first-router/actions'
import MapControls from './MapControls'
import LeafletLayers from './LeafletLayers'
import DataSelectionProvider from './draw/DataSelectionProvider'
import MapContext from './MapContext'
import { Overlay, SnapPoint } from './types'
import MapPanelContent from './MapPanelContent'
import useParam from '../../utils/useParam'
import { centerParam, zoomParam } from './query-params'

const MapView = styled.div`
  height: 100%;
  position: relative;
  z-index: 0;
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

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentOverlay, setCurrentOverlay] = useState(Overlay.None)
  const { showDrawTool } = useContext(MapContext)
  // TODO: Import 'useMatchMedia' directly once this issue has been resolved: https://github.com/Amsterdam/amsterdam-styled-components/issues/1120
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)

  return (
    <>
      <Alert level="attention" dismissible>
        <Heading as="h3">Let op: Deze nieuwe interactieve kaart is nog in aanbouw.</Heading>
        <Link darkBackground to={toMap()} as={RouterLink} inList>
          Naar de oude kaart
        </Link>
      </Alert>
      <MapView>
        <GlobalStyle />
        <MapComponent
          setInstance={setMapInstance}
          options={{
            ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
            zoom: zoom ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom,
            center: center ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
          }}
          events={{
            zoomend: () => {
              if (mapInstanceRef?.current) {
                setZoom(mapInstanceRef.current.getZoom(), 'replace')
              }
            },
            moveend: () => {
              if (mapInstanceRef?.current) {
                setCenter(mapInstanceRef.current.getCenter(), 'replace')
              }
            },
            loading: () => {
              setIsLoading(true)
            },
            load: () => {
              setIsLoading(false)
            },
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
              <MapPanelContent {...{ setCurrentOverlay, currentOverlay }} />
              <MapControls
                {...{
                  setCurrentOverlay,
                  currentOverlay,
                  showDesktopVariant,
                  isLoading,
                  showDrawTool,
                }}
              />
            </MapPanelProvider>
          </DataSelectionProvider>
        </MapComponent>
      </MapView>
    </>
  )
}

export default MapPage
