import { MapPanel, MapPanelDrawer } from '@datapunt/arm-core'
import { hooks } from '@datapunt/asc-ui'
import React, { useContext, useEffect, useMemo } from 'react'
import { detailUrlParam, locationParam } from '../../query-params'
import useParam from '../../utils/useParam'
import DetailPanel from './detail/DetailPanel'
import DataSelectionContext from './draw/DataSelectionContext'
import DrawResults from './draw/DrawResults'
import LegendPanel from './legend/LegendPanel'
import MapSearchMarker from './map-search/MapSearchMarker'
import MapSearchResults from './map-search/MapSearchResults'
import MapContext from './MapContext'
import { Overlay } from './types'

type Props = {
  setCurrentOverlay: (overlay: Overlay) => void
  currentOverlay: Overlay
}

const MapPanelContent: React.FC<Props> = ({ setCurrentOverlay, currentOverlay }) => {
  const [locationTuple] = useParam(locationParam)
  const [detailUrl] = useParam(detailUrlParam)
  const { showDrawTool, showDrawContent } = React.useContext(MapContext)
  const { dataSelection } = useContext(DataSelectionContext)
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })

  const MapPanelOrDrawer = useMemo(() => (showDesktopVariant ? MapPanel : MapPanelDrawer), [
    showDesktopVariant,
  ]) as React.FC

  const location = locationTuple ? { lat: locationTuple[0], lng: locationTuple[1] } : null

  useEffect(() => {
    if (currentOverlay !== Overlay.Legend) {
      setCurrentOverlay(location || showDrawTool ? Overlay.Results : Overlay.None)
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
