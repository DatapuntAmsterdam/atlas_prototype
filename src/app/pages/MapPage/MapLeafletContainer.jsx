import React from 'react'
import MapLeaflet from './MapLeaflet'
import getState from '../../../shared/services/redux/get-state'
import MapContext from './MapContext'

const MapLeafletContext = React.createContext(null)

const initialState = {
  brkMarkers: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const MapLeafletContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // Update the state from the url with the maplayers
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // const activeMapLayers = getQueryStringParameter('lagen')
      // setActiveMapLayers(decodeLayers(activeMapLayers))
    }
  }, [window.location.search])

  // Update the url with the maplayers
  // React.useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     if (state.activeMapLayers.length > 0)
  //       setQueryStringParameter('lagen', encodeLayers(state.activeMapLayers))
  //   }
  // }, [state.activeMapLayers])

  return (
    <MapLeafletContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </MapLeafletContext.Provider>
  )
}

const MapLeafletContainer = (props) => (
  <MapLeafletContextProvider>
    <MapLeafletComponent {...props} />
  </MapLeafletContextProvider>
)

// export const findLayer = (layers, id) =>
// layers.find((mapLayer) => {
//   const mapLayerId = id.split('-')

//   // The ID of the mapLayer when defined as part of a collection or as legendItem, is a combination of the IDs of the mapLayer and the collection it's used in
//   return mapLayer.id === (mapLayerId[1] || mapLayerId[0])
// })
// }

function getActiveBaseLayerObject(baseLayers, activeBaseLayer) {
  const allBaseLayers = Object.values(baseLayers).flat()

  return allBaseLayers.find(({ value }) => value === activeBaseLayer)
}

const MapLeafletComponent = ({ getLeafletInstance }) => {
  const { user } = getState()
  const { brkMarkers } = React.useContext(MapLeafletContext)
  const { activeBaseLayer, baseLayers } = React.useContext(MapContext)

  const baseLayer = getActiveBaseLayerObject(baseLayers, activeBaseLayer)

  React.useEffect(() => {}, [])

  return (
    <MapLeaflet
      user={user}
      baseLayer={baseLayer}
      brkMarkers={brkMarkers}
      getLeafletInstance={getLeafletInstance}
    />
  )
}

export default MapLeafletContainer
