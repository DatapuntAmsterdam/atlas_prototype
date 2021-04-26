import { Alert, Heading, Link } from '@amsterdam/asc-ui'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
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
import { mapLayersParam, panoFullScreenParam, polygonParam, polylineParam } from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'

const MapContainer: FunctionComponent = ({ children }) => {
  const [activeMapLayers] = useParam(mapLayersParam)
  const [polyline] = useParam(polylineParam)
  const [polygon] = useParam(polygonParam)

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
      <Alert level="info" dismissible>
        <Heading as="h3">Let op: Deze nieuwe interactieve kaart is nog in aanbouw.</Heading>
        <Link darkBackground to={toMap()} as={RouterLink} inList>
          Naar de oude kaart
        </Link>
      </Alert>
      <MapPage>{children}</MapPage>
    </MapContext.Provider>
  )
}

export default MapContainer
