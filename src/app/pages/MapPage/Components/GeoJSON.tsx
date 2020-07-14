import { useMapInstance } from '@datapunt/react-maps'
import { Geometry } from 'geojson'
import L from 'leaflet'
import React, { useEffect, useState } from 'react'

type Props = {
  geometry: Geometry
  options?: L.GeoJSONOptions
  onAdd?: (instance: L.GeoJSON) => void
}

const GeoJSON: React.FC<Props> = ({ geometry, options, onAdd }) => {
  const [instance, setInstance] = useState<L.GeoJSON>()
  const mapInstance = useMapInstance()

  useEffect(() => {
    if (!mapInstance) {
      return undefined
    }

    const geoJSON = L.geoJSON(geometry, options).addTo(mapInstance)

    setInstance(geoJSON)

    if (onAdd) {
      onAdd(geoJSON)
    }

    return () => {
      geoJSON.removeFrom(mapInstance)
      setInstance(undefined)
    }
  }, [instance, mapInstance, geometry])

  return null
}

export default GeoJSON
