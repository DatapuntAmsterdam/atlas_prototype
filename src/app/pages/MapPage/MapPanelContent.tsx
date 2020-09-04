import { MapPanel, MapPanelDrawer } from '@datapunt/arm-core'
import { hooks } from '@datapunt/asc-ui'
import React, { useContext, useEffect } from 'react'
import { detailUrlParam, locationParam } from './query-params'
import useParam from '../../utils/useParam'
import DetailPanel from './detail/DetailPanel'
import DataSelectionContext from './draw/DataSelectionContext'
import DrawResults from './draw/DrawResults'
import LegendPanel from './legend/LegendPanel'
import MapSearchMarker from './map-search/MapSearchMarker'
import MapSearchResults from './map-search/MapSearchResults'
import MapContext from './MapContext'
import { Overlay } from './types'

export interface MapPanelContentProps {
  setCurrentOverlay: (overlay: Overlay) => void
  currentOverlay: Overlay
}

const MapPanelContent: React.FC<MapPanelContentProps> = ({ setCurrentOverlay, currentOverlay }) => {
  const [location] = useParam(locationParam)
  const [detailUrl] = useParam(detailUrlParam)
  const { showDrawTool, showDrawContent } = useContext(MapContext)
  const { dataSelection } = useContext(DataSelectionContext)
  // TODO: Import 'useMatchMedia' directly once this issue has been resolved: https://github.com/Amsterdam/amsterdam-styled-components/issues/1120
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const MapPanelOrDrawer = showDesktopVariant ? MapPanel : MapPanelDrawer

  useEffect(() => {
    if (currentOverlay !== Overlay.Legend) {
      setCurrentOverlay(location ?? showDrawTool ? Overlay.Results : Overlay.None)
    }
  }, [location, showDrawTool, currentOverlay])

  return (
    <MapPanelOrDrawer>
      {!showDrawTool && <MapSearchMarker />}
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
        <MapSearchResults currentOverlay={currentOverlay} location={location} />
      )}
      {detailUrl && <DetailPanel detailUrl={detailUrl} />}
      {showDrawContent && dataSelection.length && (
        <DrawResults
          {...{
            currentOverlay,
          }}
        />
      )}
      {!detailUrl && <LegendPanel />}
    </MapPanelOrDrawer>
  )
}

export default MapPanelContent
