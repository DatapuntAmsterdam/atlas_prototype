import React from 'react'
import { RDGeoJSON } from '@datapunt/arm-core'
import { Geometry } from '../MapContext'

type Props = {
  geometry: Geometry
}

const GeoJSON: React.FC<Props> = ({ geometry }) => {
  return <RDGeoJSON geometry={geometry} />
}

export default GeoJSON
