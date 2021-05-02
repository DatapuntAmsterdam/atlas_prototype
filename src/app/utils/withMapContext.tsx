import { ReactNode } from 'react'
import { Map as MapComponent } from '@amsterdam/arm-core'
import MapContext, { MapContextProps } from '../pages/MapPage/MapContext'
import withAppContext from './withAppContext'

const initialState: MapContextProps = {
  panelLayers: [],
  mapLayers: [],
  legendLeafletLayers: [],
  showDrawTool: false,
  showMapDrawVisualization: false,
  detailFeature: null,
  panoFullScreen: false,
  panoImageDate: null,
  panelHeader: {
    title: 'Resultaten',
  },
  setDetailFeature: () => {},
  setShowDrawTool: () => {},
  setPanoFullScreen: () => {},
  setPanoImageDate: () => {},
  setPanelHeader: () => {},
  setShowMapDrawVisualization: () => {},
}

const withMapContext = (component: ReactNode, mapContextProps?: Partial<MapContextProps>) =>
  withAppContext(
    <MapContext.Provider
      value={{
        ...initialState,
        ...mapContextProps,
      }}
    >
      <MapComponent>{component}</MapComponent>
    </MapContext.Provider>,
  )

export default withMapContext
