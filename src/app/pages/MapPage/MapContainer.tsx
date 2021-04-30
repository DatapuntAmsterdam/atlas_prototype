import { Alert, Heading, Link } from '@amsterdam/asc-ui'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink, Route, Switch } from 'react-router-dom'
import {
  getMapLayers as fetchMapLayers,
  getPanelLayers as fetchPanelLayers,
  MapCollection,
  MapLayer,
} from '../../../map/services'
import { getUser } from '../../../shared/ducks/user/user'
import { toMap } from '../../../store/redux-first-router/actions'
import useParam from '../../utils/useParam'
import MapContext, { MapState } from './MapContext'
import MapPage from './MapPage'
import {
  mapLayersParam,
  panoFullScreenParam,
  polygonParam,
  polylineParam,
  ViewMode,
  viewParam,
} from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'
import DataSelection from '../../components/DataSelection/DataSelection'
import { routing } from '../../routes'

const MapContainer: FunctionComponent = ({ children }) => {
  const [activeMapLayers] = useParam(mapLayersParam)
  const [polyline] = useParam(polylineParam)
  const [polygon] = useParam(polygonParam)
  const [view] = useParam(viewParam)

  const [detailFeature, setDetailFeature] = useState<MapState['detailFeature']>(null)
  const [panoImageDate, setPanoImageDate] = useState<MapState['panoImageDate']>(null)
  const [layers, setLayers] = useState<{ mapLayers: MapLayer[]; panelLayers: MapCollection[] }>({
    mapLayers: [],
    panelLayers: [],
  })
  const [panelHeader, setPanelHeader] = useState<MapState['panelHeader']>({ title: 'Resultaten' })

  const showDrawContent = useMemo(() => !!(polyline || polygon), [polygon, polyline])
  const [showDrawTool, setShowDrawTool] = useState(showDrawContent)
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const user = useSelector(getUser)

  const legendLeafletLayers = useMemo(
    () => buildLeafletLayers(activeMapLayers, layers.mapLayers, user),
    [activeMapLayers, layers.mapLayers, user],
  )

  useEffect(() => {
    Promise.all([fetchPanelLayers(), fetchMapLayers()])
      .then(([panelLayersResult, mapLayersResult]) => {
        setLayers({
          panelLayers: panelLayersResult,
          mapLayers: mapLayersResult,
        })
      })
      .catch((error: string) => {
        // eslint-disable-next-line no-console
        console.error(`MapContainer: problem fetching panel and map layers: ${error}`)
      })
  }, [])

  return (
    <MapContext.Provider
      value={{
        panelHeader,
        mapLayers: layers.mapLayers,
        panelLayers: layers.panelLayers,
        detailFeature,
        panoImageDate,
        legendLeafletLayers,
        setDetailFeature,
        setPanelHeader,
        showDrawTool,
        setShowDrawTool,
        showDrawContent,
        panoFullScreen,
        setPanoFullScreen,
        setPanoImageDate,
      }}
    >
      <Switch>
        <Route
          path={[
            routing.addresses_TEMP.path,
            routing.establishments_TEMP.path,
            routing.cadastralObjects_TEMP.path,
          ]}
          exact
        >
          {view === ViewMode.Full ? <DataSelection /> : <MapPage>{children}</MapPage>}
        </Route>
        <Route path="*" component={MapPage} />
      </Switch>
    </MapContext.Provider>
  )
}

export default MapContainer
