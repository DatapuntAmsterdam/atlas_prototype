import { useMapInstance } from '@amsterdam/react-maps'
import { useEffect } from 'react'
import type { LeafletEventHandlerFn, LeafletEventHandlerFnMap } from 'leaflet'
import type { DependencyList } from 'react'

export default function useLeafletEvent<T extends keyof LeafletEventHandlerFnMap>(
  eventName: T,
  handler: Exclude<LeafletEventHandlerFnMap[T], undefined>,
  deps: DependencyList,
) {
  const mapInstance = useMapInstance()

  useEffect(() => {
    // The types between the event handler and `on()` method are not consistent
    // We have to cast it down to the closest common one.
    mapInstance.on(eventName as string, handler as LeafletEventHandlerFn)

    return () => {
      mapInstance.off(eventName as string, handler as LeafletEventHandlerFn)
    }
  }, [mapInstance, ...deps])
}
