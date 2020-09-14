import { LeafletMouseEvent } from 'leaflet'
import { useEffect } from 'react'
import { useMapInstance } from '@datapunt/react-maps'

const useMapClick = (
  callback: (e: LeafletMouseEvent) => void,
  dependencies: React.DependencyList = [],
) => {
  const mapInstance = useMapInstance()

  if (typeof callback !== 'function') {
    // eslint-disable-next-line no-console
    console.warn('hook `useMapClick` needs a callback function as an argument')
    return
  }

  useEffect(() => {
    if (!mapInstance) {
      return undefined
    }

    mapInstance.on('click', callback)

    return () => {
      mapInstance.off('click', callback)
    }
  }, [mapInstance, ...dependencies])
}

export default useMapClick
