import { RDGeoJSON as RDGeoJSONComponent } from '@amsterdam/arm-core'
import { Geometry } from 'geojson'
import React from 'react'

type Props = {
  geometry: Geometry
}

const RDGeoJSON: React.FC<Props> = ({ geometry }) => {
  // @ts-ignore
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
