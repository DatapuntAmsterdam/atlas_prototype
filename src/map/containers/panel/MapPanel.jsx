import { ChevronUp, Info } from '@amsterdam/asc-assets'
import { Alert, Icon, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import MapLegend from '../../components/legend/MapLegend'
import MapType from '../../components/type/MapType'
import { isAuthorised } from '../../utils/map-layer'
import MapLayers from '../../../shared/assets/icons/icon-map-layers.svg'

const ZoomInAlert = styled(Alert)`
  width: calc(100% - ${themeSpacing(6)});
  padding: ${themeSpacing(2)};
  margin: ${themeSpacing(0, 3, 4, 3)};
`

const ZoomInAlertContent = styled.div`
  display: flex;

  ${Icon} {
    margin-right: ${themeSpacing(2)};
  }
`

const MapPanel = ({
  activeBaseLayer,
  onBaseLayerToggle,
  onMapPanelToggle,
  onLayerToggle = () => {},
  onLayerVisibilityToggle = () => {},
  overlays,
  printMode,
  onAddLayers,
  onRemoveLayers,
  activeMapLayers = [],
  isMapPanelVisible = true,
  mapBaseLayers = {},
  panelLayers = [],
  user = {},
  zoomLevel = 0,
}) => {
  const someLayersRequireZoom = activeMapLayers.some(
    (mapLayer) => isAuthorised(mapLayer, user) && zoomLevel < mapLayer.minZoom,
  )

  return (
    <div
      aria-label={
        isMapPanelVisible
          ? 'Kaartlagen legenda, Kaartlagen verbergen'
          : 'Kaartlagen legenda, Kaartlagen tonen'
      }
      aria-expanded={isMapPanelVisible}
      className={`
            map-panel
            map-panel--${isMapPanelVisible ? 'expanded' : 'collapsed'}
            map-panel--has${activeMapLayers.length > 0 ? '' : '-no'}-active-layers
          `}
    >
      <div className="map-panel__heading">
        <button
          type="button"
          className="map-panel__toggle"
          onClick={onMapPanelToggle}
          title={isMapPanelVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen'}
        >
          <MapLayers />
          <h2 className="map-panel__heading-title" aria-hidden="true">
            Kaartlagen
          </h2>
          <span
            className={`
                map-panel__toggle--icon
                map-panel__toggle--icon-${isMapPanelVisible ? 'collapse' : 'expand'}
              `}
          >
            <ChevronUp />
          </span>
        </button>
      </div>
      <div className="scroll-wrapper">
        {mapBaseLayers?.aerial?.length && mapBaseLayers?.topography?.length && (
          <MapType
            activeBaseLayer={activeBaseLayer}
            baseLayers={mapBaseLayers}
            onBaseLayerToggle={onBaseLayerToggle}
          />
        )}
        {someLayersRequireZoom && (
          <ZoomInAlert level="info">
            <ZoomInAlertContent>
              <Icon>
                <Info />
              </Icon>
              Een of meerdere geselecteerde kaartlagen zijn nog niet zichtbaar. Zoom in op de kaart
              om deze te zien.
            </ZoomInAlertContent>
          </ZoomInAlert>
        )}
        {panelLayers.map(({ id, mapLayers, title }) => (
          <MapLegend
            onAddLayers={onAddLayers}
            onRemoveLayers={onRemoveLayers}
            key={id}
            activeMapLayers={mapLayers}
            onLayerToggle={onLayerToggle}
            onLayerVisibilityToggle={onLayerVisibilityToggle}
            overlays={overlays}
            user={user}
            title={title}
            zoomLevel={zoomLevel}
            printMode={printMode}
          />
        ))}
      </div>
    </div>
  )
}

MapPanel.defaultProps = {
  activeMapLayers: [],
  isMapPanelVisible: true,
  map: {},
  mapBaseLayers: {},
  panelLayers: [],
  user: {},
  zoomLevel: 0,
}

export default MapPanel
