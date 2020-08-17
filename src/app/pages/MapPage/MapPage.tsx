import {
  BaseLayer,
  constants,
  Map,
  MapPanel,
  MapPanelDrawer,
  MapPanelProvider,
} from '@datapunt/arm-core'
import { PositionPerSnapPoint } from '@datapunt/arm-core/es/components/MapPanel/constants'
import { NonTiledLayer } from '@datapunt/arm-nontiled'
import { Alert, Heading, hooks, Link } from '@datapunt/asc-ui'
import { TileLayer } from '@datapunt/react-maps'
import React, { useEffect, useMemo, useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled, { createGlobalStyle } from 'styled-components'
import { toMap } from '../../../store/redux-first-router/actions'
import NotificationLevel from '../../models/notification'
import DrawContent from './Components/DrawContent'
import GeoJSON from './Components/GeoJSON'
import PointSearchMarker from './Components/PointSearchMarker'
import ViewerContainer from './Components/ViewerContainer'
import DataSelectionProvider from './DataSelectionProvider'
import MapContext, { OverlayType, TmsOverlay, WmsOverlay } from './MapContext'
import DetailPanel from './panels/DetailPanel'
import LegendPanel from './panels/LegendPanel'
import PointSearchPanel from './panels/PointSearchPanel'
import { Overlay, SnapPoint } from './types'
import handleMapClick from './utils/handleMapClick'

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

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

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDrawTool, setShowDrawTool] = useState(false)
  const [currentOverlay, setCurrentOverlay] = useState<Overlay>(Overlay.None)
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const {
    location,
    mapLayers,
    activeMapLayers,
    activeBaseLayer,
    overlays,
    detailUrl,
    getOverlays,
    setLocation,
    setDetailUrl,
    resetDrawingGeometries,
    geometry,
  } = React.useContext(MapContext)

  const handleToggleDrawTool = React.useCallback((show: boolean = false) => {
    setShowDrawTool(show)

    if (!show) {
      resetDrawingGeometries()
    }
  }, [])

  const tmsLayers = overlays.filter(
    (overlay): overlay is TmsOverlay => overlay.type === OverlayType.Tms,
  )

  const wmsLayers = overlays.filter(
    (overlay): overlay is WmsOverlay => overlay.type === OverlayType.Wms,
  )

  useEffect(() => {
    if (currentOverlay !== Overlay.Legend) {
      setCurrentOverlay(location || showDrawTool ? Overlay.Results : Overlay.None)
    }
  }, [location, showDrawTool, currentOverlay])

  const MapPanelOrDrawer = useMemo(() => (showDesktopVariant ? MapPanel : MapPanelDrawer), [
    showDesktopVariant,
  ])

  useEffect(() => {
    if (activeMapLayers?.length && mapLayers?.length) {
      getOverlays()
    }
  }, [activeMapLayers, mapLayers])

  return (
    <>
      <Alert level={NotificationLevel.Attention} dismissible>
        <Heading as="h3">Let op: Deze nieuwe interactieve kaart is nog in aanbouw.</Heading>
        <Link to={toMap()} as={RouterLink} inList darkBackground>
          Naar de oude kaart
        </Link>
      </Alert>
      <MapView>
        <GlobalStyle />
        <Map
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
          {tmsLayers.map(({ overlayOptions: options, id }) => (
            <TileLayer
              key={id}
              options={options}
              events={{
                loading: () => setIsLoading(true),
                load: () => setIsLoading(false),
              }}
            />
          ))}
          {wmsLayers.map(({ url, overlayOptions: options, id, params }) => (
            <NonTiledLayer key={id} url={url} options={options} params={params} />
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
                  <LegendPanel
                    stackOrder={3}
                    animate
                    onClose={() => {
                      setCurrentOverlay(location ? Overlay.Results : Overlay.None)
                    }}
                  />
                )}
                {!showDrawTool && !detailUrl && location && (
                  <PointSearchPanel
                    setLocation={setLocation}
                    currentOverlay={currentOverlay}
                    location={location}
                  />
                )}
                {detailUrl && <DetailPanel detailUrl={detailUrl} />}
                <DrawContent
                  {...{ showDrawTool, currentOverlay, setShowDrawTool: handleToggleDrawTool }}
                />
                {!detailUrl && <LegendPanel />}
              </MapPanelOrDrawer>
              <ViewerContainer
                {...{
                  setCurrentOverlay,
                  currentOverlay,
                  showDesktopVariant,
                  isLoading,
                  handleToggleDrawTool,
                  showDrawTool,
                }}
              />
            </DataSelectionProvider>
          </MapPanelProvider>
        </Map>
      </MapView>
    </>
  )
}

export default MapPage
