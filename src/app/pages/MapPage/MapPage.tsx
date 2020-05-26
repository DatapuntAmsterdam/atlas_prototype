import L, { LatLngTuple, Polygon, Polyline } from 'leaflet'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ViewerContainer } from '@datapunt/asc-ui'
import { components } from '@datapunt/amsterdam-react-maps'
import useStateRef from '@datapunt/amsterdam-react-maps/lib/utils/useStateRef'
import DrawTool from './Components/DrawTool'
import MapPanelContainer from './MapPanelContainer'
import MAP_CONFIG from '../../../map/services/map.config'
import MapContext from './MapContext'

// Find out why the import is not found
// @ts-ignore
const { Map, BaseLayer, MarkerClusterGroup, NonTiledLayer } = components

const StyledMap = styled(Map)`
  width: 100%;
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
  position: relative;
  max-height: 80vh;
  overflow: auto;
  & > section {
    position: relative;
    max-height: 100%;
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
  const [showDrawTool, setShowDrawTool] = useState(true)
  const [, setMapInstance] = useState<L.Map>()
  const [markerGroups, setMarkerGroups, markerGroupsRef] = useStateRef<MarkerGroup[]>([])

  const { activeMapLayers, mapLayers, overlays, getOverlays } = React.useContext(MapContext)

  // const tmsLayers = layers.filter((layer) => layer.type === MAP_CONFIG.MAP_LAYER_TYPES.TMS)
  const nonTmsLayers =
    overlays && overlays.filter((overlay) => overlay.type !== MAP_CONFIG.MAP_LAYER_TYPES.TMS)

  React.useEffect(() => {
    if (activeMapLayers && activeMapLayers?.length) getOverlays()
  }, [activeMapLayers])

  return (
    <>
      <StyledMap setInstance={setMapInstance}>
        {showDrawTool &&
          markerGroups.map(({ markers, id }) => <MarkerClusterGroup key={id} markers={markers} />)}
        <BaseLayer />
        {nonTmsLayers?.map(({ url, overlayOptions: options, id }) => (
          <NonTiledLayer key={id} url={url} options={options} />
        ))}
        <StyledViewerContainer
          bottomLeft={
            <MapPanelContainerWrapper>
              <MapPanelContainer />
            </MapPanelContainerWrapper>
          }
          topRight={
            <DrawTool
              onToggle={setShowDrawTool}
              setMarkerGroups={setMarkerGroups}
              markerGroupsRef={markerGroupsRef}
            />
          }
        />
      </StyledMap>
    </>
  )
}

export default MapPage
