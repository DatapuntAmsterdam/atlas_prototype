import { ReactNode } from 'react'
import { Map as MapComponent } from '@amsterdam/arm-core'
import MapContext, { initialState, MapContextProps } from '../pages/MapPage/MapContext'
import withAppContext from './withAppContext'

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
