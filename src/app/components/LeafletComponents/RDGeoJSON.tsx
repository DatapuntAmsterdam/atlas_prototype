import { RDGeoJSON as RDGeoJSONComponent } from '@amsterdam/arm-core'
import { Geometry } from 'geojson'
import { FunctionComponent } from 'react'

type Props = {
  geometry: Geometry
}

const RDGeoJSON: FunctionComponent<Props> = ({ geometry }) => {
  // @ts-ignore
  return <RDGeoJSONComponent args={geometry} />
}

export default RDGeoJSON
