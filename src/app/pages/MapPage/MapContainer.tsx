import { Alert, Heading, hooks, Link } from '@amsterdam/asc-ui'
import { Feature } from 'geojson'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
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
import MapContext, { initialState, MapContextProps, MapState } from './MapContext'
import MapPage from './MapPage'
import { mapLayersParam, panoFullScreenParam, polygonsParam, polylinesParam } from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'

type Action =
  | { type: 'setPanelLayers'; payload: MapCollection[] }
  | { type: 'setMapLayers'; payload: MapLayer[] }
  | { type: 'setDetailFeature'; payload: Feature | null }

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
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const [isMobile] = hooks.useMatchMedia({ maxBreakpoint: 'tabletM' })
  const user = useSelector(getUser)

  useEffect(() => {
    setPanoFullScreen(isMobile, 'replace')
  }, [isMobile, setPanoFullScreen])

  const legendLeafletLayers = useMemo(
    () => buildLeafletLayers(activeMapLayers, state.mapLayers, user),
    [activeMapLayers, state.mapLayers, user],
  )

  function setDetailFeature(payload: Feature | null) {
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
        panoFullScreen,
        setPanoFullScreen,
      }}
    >
      <Alert level="attention" dismissible>
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
