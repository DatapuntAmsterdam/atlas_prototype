import React from 'react'
import { RDGeoJSON as RDGeoJSONComponent } from '@datapunt/arm-core'
import { Geometry } from 'geojson'

type Props = {
  geometry: Geometry
}

const RDGeoJSON: React.FC<Props> = ({ geometry }) => {
  // @ts-ignore
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
