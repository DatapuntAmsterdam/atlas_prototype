import React from 'react'
import { components } from '@datapunt/amsterdam-react-maps'
import { Geometry } from '../MapContext'

// Find out why the import is not found
// @ts-ignore
const { RDGeoJSON } = components

type Props = {
  geometry: Geometry
}

const GeoJSON: React.FC<Props> = ({ geometry }) => {
  console.log('hiiiiii', geometry)

  return (
    <RDGeoJSON
      geometry={geometry}
      //   options={{ style: defaultStyle }}
    />
  )
}

export default GeoJSON
