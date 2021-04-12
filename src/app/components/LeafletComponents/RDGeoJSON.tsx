import { RDGeoJSON as RDGeoJSONComponent } from '@amsterdam/arm-core'
import { Geometry } from 'geojson'
import { FunctionComponent } from 'react'

export interface RDGeoJSONProps {
  geometry: Geometry
}

const RDGeoJSON: FunctionComponent<RDGeoJSONProps> = ({ geometry }) => {
  // @ts-ignore
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
