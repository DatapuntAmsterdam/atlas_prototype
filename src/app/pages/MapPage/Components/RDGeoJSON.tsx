import React from 'react'
import { RDGeoJSON as RDGeoJSONComponent } from '@datapunt/arm-core'
import { Geometry } from '../MapContext'

type Props = {
  geometry: Geometry
}

const RDGeoJSON: React.FC<Props> = ({ geometry }) => {
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
