import L, { LatLngTuple, Polygon, Polyline, LeafletMouseEvent } from 'leaflet'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ViewerContainer, Spinner } from '@datapunt/asc-ui'
import { components, utils } from '@datapunt/arm-core'
import { NonTiledLayer } from '@datapunt/arm-nontiled'
import { MarkerClusterGroup } from '@datapunt/arm-cluster'
import DrawTool from './Components/DrawTool'
import GeoJSON from './Components/GeoJSON'
import MapPanelContainer from './MapPanelContainer'
import MAP_CONFIG from '../../../map/services/map.config'
import MapContext from './MapContext'
import handleMapClick from './utils/handleMapClick'
import MapPreviewPanelContainer from './MapPreviewPanelContainer'

// Find out why the import is not found
const { Map, BaseLayer, Marker } = components
const { useStateRef } = utils

const StyledMap = styled(Map)`
  width: 100%;
  height: calc(100% - 50px);
  top: 50px;
`

const MapView = styled.div`
  height: calc(100% - 50px);
  top: 50px;
`

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400;
  height: calc(100% - 50px);
  top: 50px;
`

// This can be deleted once we use the new MapDrawer / MapPanel
const MapPanelContainerWrapper = styled.div`
  bottom: 20px;
  position: absolute;

  & > section {
    position: relative;
    max-height: 80vh;
  }
`

type extraLayerTypes = {
  id: string
  editing: {
    _enabled: boolean
    disable: () => void
  }
}

type PolygonType = extraLayerTypes & Polygon
type PolylineType = extraLayerTypes & Polyline

export type ExtendedLayer = PolygonType | PolylineType

type MarkerGroup = {
  id: string
  markers: LatLngTuple[]
}

const MapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDrawTool, setShowDrawTool] = useState(true)
  const [mapInstance, setMapInstance] = useState<L.Map>()
  const [markerGroups, setMarkerGroups, markerGroupsRef] = useStateRef<MarkerGroup[]>([])

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

  // const tmsLayers = layers.filter((layer) => layer.type === MAP_CONFIG.MAP_LAYER_TYPES.TMS)
  const nonTmsLayers =
    overlays && overlays.filter((overlay) => overlay.type !== MAP_CONFIG.MAP_LAYER_TYPES.TMS)

  useEffect(() => {
    if (activeMapLayers && activeMapLayers?.length) getOverlays()

    getOverlays(activeMapLayers, mapLayers, {})
  }, [activeMapLayers])

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on('click', (e: LeafletMouseEvent) =>
        handleMapClick(e, setLocation, setDetailUrl, overlays),
      )
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('click', (e: LeafletMouseEvent) =>
          handleMapClick(e, setLocation, setDetailUrl, overlays),
        )
      }
    }
  }, [mapInstance, overlays])

  return (
    <MapView>
      <StyledMap
        setInstance={setMapInstance}
        events={{
          loading: () => setIsLoading(true),
          load: () => setIsLoading(false),
        }}
      >
        {showDrawTool &&
          markerGroups.map(({ markers, id }) => <MarkerClusterGroup key={id} markers={markers} />)}
        <BaseLayer />
        {location && <Marker latLng={location} />}
        {geometry && <GeoJSON geometry={geometry} />}
        {nonTmsLayers?.map(({ url, overlayOptions: options, id }) => (
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
        <StyledViewerContainer
          bottomRight={isLoading ? <Spinner /> : null}
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
      </StyledMap>
      <MapPanelContainerWrapper>
        <MapPanelContainer />
      </MapPanelContainerWrapper>
    </MapView>
  )
}

export default MapPage
