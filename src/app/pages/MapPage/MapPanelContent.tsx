import { MapPanel, MapPanelDrawer } from '@amsterdam/arm-core'
import { hooks } from '@amsterdam/asc-ui'
import { useContext, useEffect, FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import MapContext from './MapContext'
import useParam from '../../utils/useParam'
import DetailPanel from './detail/DetailPanel'
import DataSelectionContext from './draw/DataSelectionContext'
import DrawResults from './draw/DrawResults'
import LegendPanel from './legend/LegendPanel'
import MapSearchResults from './map-search/MapSearchResults'
import { locationParam } from './query-params'
import { Overlay } from './types'
import { routing } from '../../routes'

export interface MapPanelContentProps {
  setCurrentOverlay: (overlay: Overlay) => void
  currentOverlay: Overlay
}

const MapPanelContent: FunctionComponent<MapPanelContentProps> = ({
  setCurrentOverlay,
  currentOverlay,
}) => {
  const [location] = useParam(locationParam)
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
      {currentOverlay === Overlay.Legend && (
        <LegendPanel
          stackOrder={3}
          animate
          onClose={() => {
            setCurrentOverlay(location ? Overlay.Results : Overlay.None)
          }}
        />
      )}
      <Switch>
        <Route path={[routing.dataSearchGeo_TEMP.path, routing.panorama_TEMP.path]}>
          <MapSearchResults currentOverlay={currentOverlay} />
        </Route>
        <Route path={[routing.dataDetail_TEMP.path]}>
          <DetailPanel />
        </Route>
        <Route
          path={[
            routing.addresses_TEMP.path,
            routing.establishments_TEMP.path,
            routing.cadastralObjects_TEMP.path,
          ]}
          exact
        >
          <DrawResults
            {...{
              currentOverlay,
            }}
          />
        </Route>
      </Switch>
      {showDrawContent && dataSelection.length && (
        <DrawResults
          {...{
            currentOverlay,
          }}
        />
      )}
      <LegendPanel />
    </MapPanelOrDrawer>
  )
}

export default MapPanelContent
