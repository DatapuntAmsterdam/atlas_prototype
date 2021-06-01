import type { FunctionComponent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { MapCollection, MapLayer } from './legacy/services'
import {
  getMapLayers as fetchMapLayers,
  getPanelLayers as fetchPanelLayers,
} from './legacy/services'
import { getUser } from '../../../shared/ducks/user/user'
import useParam from '../../utils/useParam'
import type { MapState } from './MapContext'
import MapContext from './MapContext'
import { mapLayersParam, panoFullScreenParam } from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'
import { DrawerState } from './components/DrawerOverlay'

const MapContainer: FunctionComponent = ({ children }) => {
  const [activeMapLayers] = useParam(mapLayersParam)
  const [legendActive, setLegendActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [drawerState, setDrawerState] = useState(DrawerState.Open)
  const [detailFeature, setDetailFeature] = useState<MapState['detailFeature']>(null)
  const [panoImageDate, setPanoImageDate] = useState<MapState['panoImageDate']>(null)
  const [showMapDrawVisualization, setShowMapDrawVisualization] = useState(false)
  const [layers, setLayers] = useState<{ mapLayers: MapLayer[]; panelLayers: MapCollection[] }>({
    mapLayers: [],
    panelLayers: [],
  })
  const [panelHeader, setPanelHeader] = useState<MapState['panelHeader']>({ title: 'Resultaten' })
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
        panoFullScreen,
        setPanoFullScreen,
        setPanoImageDate,
        showMapDrawVisualization,
        setShowMapDrawVisualization,
        setLegendActive,
        setDrawerState,
        legendActive,
        drawerState,
        setLoading,
        loading,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export default MapContainer
