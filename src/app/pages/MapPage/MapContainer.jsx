import React from 'react'
import MapPanel from '../../../map/containers/panel/MapPanel'
import {
  getMapBaseLayers as fetchBaseLayers,
  getPanelLayers as fetchPanelLayers,
  getMapLayers as fetchMapLayers,
} from '../../../map/services'
import { encodeLayers, decodeLayers } from '../../../store/queryParameters'
import getState from '../../../shared/services/redux/get-state'
import MapPage from './MapPage'
import MapContext from './MapContext'

function setQueryStringParameter(name, value) {
  const params = new URLSearchParams(window.location.search)

  params.set(name, value)

  window.history.pushState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`))
}

export function getQueryStringParameter(name) {
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

export function getActiveBaseLayer() {
  return getQueryStringParameter('achtergrond') || 'topografie'
}

export const DEFAULT_LAT = 52.3731081
export const DEFAULT_LNG = 4.8932945

const initialState = {
  activeBaseLayer: 'topografie',
  activeMapLayers: [],
  baseLayers: [],
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  zoomLevel: 11,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setActiveBaseLayer':
      return {
        ...state,
        activeBaseLayer: action.payload,
      }
    case 'getBaseLayers':
      return {
        ...state,
        baseLayers: action.payload,
      }
    case 'getPanelLayers':
      return {
        ...state,
        panelLayers: action.payload,
      }
    case 'getMapLayers':
      return {
        ...state,
        mapLayers: action.payload,
      }
    case 'setActiveMapLayers':
      // TODO: simplify this in the new MapPanel
      return {
        ...state,
        activeMapLayers: state.activeMapLayers.some((overlay) =>
          action.payload.map(({ id }) => id).includes(overlay.id),
        )
          ? [
              ...state.activeMapLayers.filter((overlay) => {
                return !action.payload.map(({ id }) => id).includes(overlay.id)
              }),
            ]
          : [
              ...state.activeMapLayers,
              ...action.payload
                .reverse()
                .map(({ id: mapLayerId, isVisible }) => ({ id: mapLayerId, isVisible })),
            ],
      }
    case 'setVisibleMapLayers':
      // TODO: simplify this in the new MapPanel
      return {
        ...state,
        activeMapLayers: state.activeMapLayers.map((overlay) => ({
          ...overlay,
          isVisible:
            overlay.id === action.payload.mapLayerId ? action.payload.isVisible : overlay.isVisible,
        })),
      }
    case 'setMapPanelVisible':
      return {
        ...state,
        isMapPanelVisible: action.payload,
      }
    default:
      return state
  }
}

const MapContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // Get the user from the redux state
  const { user } = getState()

  function setActiveBaseLayer(payload) {
    if (typeof window !== 'undefined') {
      setQueryStringParameter('achtergrond', payload)
    }

    dispatch({ type: 'setActiveBaseLayer', payload })
  }

  function setActiveMapLayers(payload) {
    dispatch({ type: 'setActiveMapLayers', payload })
  }

  function setVisibleMapLayers(mapLayerId, isVisible) {
    dispatch({ type: 'setVisibleMapLayers', payload: { mapLayerId, isVisible: !isVisible } })
  }

  function setMapPanelVisible() {
    if (typeof window !== 'undefined') {
      setQueryStringParameter('legenda', !state.isMapPanelVisible)
    }

    dispatch({ type: 'setMapPanelVisible', payload: !state.isMapPanelVisible })
  }

  async function getBaseLayers() {
    const baseLayers = await fetchBaseLayers()

    dispatch({
      type: 'getBaseLayers',
      payload: baseLayers.reduce(
        (result, item) => ({
          ...result,
          [item.category]: result[item.category] ? [...result[item.category], item] : [item],
        }),
        {},
      ),
    })
  }

  async function getPanelLayers() {
    const panelLayers = await fetchPanelLayers()

    dispatch({
      type: 'getPanelLayers',
      payload: panelLayers,
    })
  }

  async function getMapLayers() {
    const mapLayers = await fetchPanelLayers()

    dispatch({
      type: 'getMapLayers',
      payload: mapLayers,
    })
  }

  // Update the state from the url with the maplayers
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeMapLayers = getQueryStringParameter('lagen')

      setActiveMapLayers(decodeLayers(activeMapLayers))
    }
  }, [window.location.search])

  // Update the url with the maplayers
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // if (state.activeMapLayers.length > 0)
      //   setQueryStringParameter('lagen', encodeLayers(state.activeMapLayers))
    }
  }, [state.activeMapLayers])

  return (
    <MapContext.Provider
      value={{
        ...state,
        user,
        setActiveBaseLayer,
        setActiveMapLayers,
        setVisibleMapLayers,
        setMapPanelVisible,
        getBaseLayers,
        getPanelLayers,
        getMapLayers,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

const MapPanelContainer = () => (
  <MapContextProvider>
    <MapPanelComponent />
  </MapContextProvider>
)

const MapPanelComponent = () => {
  const {
    baseLayers,
    panelLayers,
    activeBaseLayer,
    activeMapLayers,
    isMapPanelVisible,
    zoomLevel,
    setActiveBaseLayer,
    setActiveMapLayers,
    setVisibleMapLayers,
    setMapPanelVisible,
    getBaseLayers,
    getPanelLayers,
    getMapLayers,
  } = React.useContext(MapContext)

  React.useEffect(() => {
    getBaseLayers()
    getPanelLayers()
    getMapLayers()
  }, [])

  function onLayerToggle(payload) {
    setActiveMapLayers(
      payload.legendItems?.some(({ notSelectable }) => !notSelectable) &&
        payload.legendItems.length > 0
        ? payload.legendItems.map(({ id: legendItemId }) => ({ id: legendItemId, isVisible: true }))
        : [{ id: payload.id, isVisible: true }],
    )
  }

  return (
    <MapPage
      mapBaseLayers={baseLayers}
      panelLayers={panelLayers}
      activeBaseLayer={activeBaseLayer}
      overlays={activeMapLayers}
      onBaseLayerToggle={setActiveBaseLayer}
      onLayerToggle={onLayerToggle}
      onLayerVisibilityToggle={setVisibleMapLayers}
      onMapPanelToggle={setMapPanelVisible}
      isMapPanelVisible={isMapPanelVisible}
      zoomLevel={zoomLevel}
    />
  )
}

export default MapPanelContainer
