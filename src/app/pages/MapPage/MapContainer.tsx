import { Alert, Heading, Link } from '@amsterdam/asc-ui'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Feature } from 'geojson'
import { FunctionComponent, useEffect, useMemo, useReducer, useState } from 'react'
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
import MapContext, { initialState, MapState } from './MapContext'
import MapPage from './MapPage'
import { mapLayersParam, panoFullScreenParam, polygonParam, polylineParam } from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'

type Action =
  | { type: 'setPanelLayers'; payload: MapCollection[] }
  | { type: 'setMapLayers'; payload: MapLayer[] }
  | { type: 'setDetailFeature'; payload: Feature | null }
  | { type: 'setPanoImageDate'; payload: string | null }

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
    case 'setPanoImageDate':
      return {
        ...state,
        panoImageDate: action.payload,
      }
    default:
      return state
  }
}

const MapContainer: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [activeMapLayers] = useParam(mapLayersParam)
  const [polyline] = useParam(polylineParam)
  const [polygon] = useParam(polygonParam)
  const showDrawContent = !!(polyline || polygon)
  const [showDrawTool, setShowDrawTool] = useState(showDrawContent)
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const user = useSelector(getUser)

  const legendLeafletLayers = useMemo(
    () => buildLeafletLayers(activeMapLayers, state.mapLayers, user),
    [activeMapLayers, state.mapLayers, user],
  )

  function setDetailFeature(payload: Feature | null) {
    dispatch({ type: 'setDetailFeature', payload })
  }

  function setPanoImageDate(payload: string | null) {
    dispatch({ type: 'setPanoImageDate', payload })
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
    Promise.all([getPanelLayers(), getMapLayers()])
      .then(() => {})
      .catch((error: string) => {
        // eslint-disable-next-line no-console
        console.error(`MapContainer: problem fetching panel and map layers: ${error}`)
      })
  }, [])

  return (
    <MapContext.Provider
      value={{
        ...state,
        legendLeafletLayers,
        setDetailFeature,
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
