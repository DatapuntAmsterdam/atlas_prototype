import { DependencyList, useEffect, useMemo } from 'react'
import { useMapInstance } from '@amsterdam/react-maps'
import { LeafletEventHandlerFnMap } from 'leaflet'

// Todo: this should be moved to react-maps
const useLeafletMapEventHandler = (
  events: LeafletEventHandlerFnMap,
  dependencies: DependencyList,
) => {
  const mapInstance = useMapInstance()

  const eventsArray = useMemo(() => Object.entries(events || {}), dependencies)

  useEffect(() => {
    eventsArray.forEach(([eventName, method]) => {
      if (mapInstance) {
        try {
          mapInstance.on(eventName, method)
        } catch {
          // eslint-disable-next-line no-console
          console.warn(`Unable to use event, perhaps the '${eventName}' event doesn't exist`)
        }
      }
    })

    return () => {
      eventsArray.forEach(([eventName, method]) => {
        if (mapInstance) {
          mapInstance.off(eventName, method)
        }
      })
    }
  }, [mapInstance, eventsArray, ...dependencies])
}

export default useLeafletMapEventHandler
