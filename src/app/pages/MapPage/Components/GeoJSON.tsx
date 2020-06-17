import React, { useEffect, useState } from 'react'
import { useMapInstance } from '@datapunt/react-maps'
import L from 'leaflet'
import { Geometry } from '../MapContext'

type Props = {
  geometry: Geometry
  options: any
  setInstance?: (instance: any) => void
}

const GeoJSON: React.FC<Props> = ({ geometry, options, setInstance: setInstanceProp }) => {
  const [instance, setInstance] = useState()

  const mapInstance = useMapInstance()

  useEffect(() => {
    if (!mapInstance) {
      return undefined
    }
    ;(async () => {
      if (instance) {
        return
      }
      const geo = L.geoJSON([geometry], options)

      geo.addTo(mapInstance)
      setInstance(geo)
      if (setInstanceProp) {
        setInstanceProp(geo)
      }
    })()

    return () => {
      if (instance && mapInstance) {
        instance.removeFrom(mapInstance)
        setInstance(undefined)
      }
    }
  }, [instance, mapInstance, geometry])

  return null
}

export default GeoJSON
