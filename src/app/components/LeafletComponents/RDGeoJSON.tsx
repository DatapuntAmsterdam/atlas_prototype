import { RDGeoJSON as RDGeoJSONComponent } from '@amsterdam/arm-core'
import type { FunctionComponent } from 'react'
import type { Geometry } from 'geojson'

export interface RDGeoJSONProps {
  geometry: Geometry
}

const RDGeoJSON: FunctionComponent<RDGeoJSONProps> = ({ geometry }) => {
  // @ts-ignore
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
