import { Feature } from 'geojson'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getMapLayers as fetchMapLayers,
  getPanelLayers as fetchPanelLayers,
  MapCollection,
  MapLayer,
} from '../../../map/services'
import { getUser } from '../../../shared/ducks/user/user'
import { mapLayersParam, polygonsParam, polylinesParam } from './query-params'
import useParam from '../../utils/useParam'
import MapContext, { initialState, MapContextProps, MapState } from './MapContext'
import MapPage from './MapPage'
import buildLeafletLayers from './utils/buildLeafletLayers'

type Action =
  | { type: 'setPanelLayers'; payload: MapCollection[] }
  | { type: 'setMapLayers'; payload: MapLayer[] }
  | { type: 'setDetailFeature'; payload: Feature }

const reducer = (state: MapState, action: Action): MapState => {
  switch (action.type) {
    case 'setPanelLayers':
      return {
        ...state,
        panelLayers: action.payload,
      }
    case 'setMapLayers':
      return {
        ...state,
        mapLayers: action.payload,
      }
    case 'setDetailFeature':
      return {
        ...state,
        detailFeature: action.payload,
      }
    default:
      return state
  }
}

const MapContainer: React.FC<MapContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [activeMapLayers] = useParam(mapLayersParam)
  const [polylines] = useParam(polylinesParam)
  const [polygons] = useParam(polygonsParam)
  const showDrawContent = polygons.length > 0 || polylines.length > 0
  const [showDrawTool, setShowDrawTool] = useState(showDrawContent)
  const user = useSelector(getUser)

  const legendLeafletLayers = useMemo(
    () => buildLeafletLayers(activeMapLayers, state.mapLayers, user),
    [activeMapLayers, state.mapLayers, user],
  )

  function setDetailFeature(payload: Feature) {
    dispatch({ type: 'setDetailFeature', payload })
  }

  async function getPanelLayers() {
    const panelLayers = await fetchPanelLayers()

    dispatch({
      type: 'setPanelLayers',
      payload: panelLayers,
    })
  }

  async function getMapLayers() {
    const mapLayers = await fetchMapLayers()

    dispatch({
      type: 'setMapLayers',
      payload: mapLayers,
    })
  }

  useEffect(() => {
    getPanelLayers()
    getMapLayers()
  }, [])

  return (
    <MapContext.Provider
      value={{
        ...state,
        legendLeafletLayers,
        setDetailFeature,
        getPanelLayers,
        getMapLayers,
        showDrawTool,
        setShowDrawTool,
        showDrawContent,
      }}
    >
      <MapPage>{children}</MapPage>
    </MapContext.Provider>
  )
}

export default MapContainer
