import L from 'leaflet'
import 'proj4'
import 'proj4leaflet'
import { EARTH_RADIUS, RD } from './crs-config'

function getCrs() {
  const rdSettings = RD
  rdSettings.transformation.bounds = L.bounds.apply(null, RD.transformation.bounds)
  const crs = new L.Proj.CRS(rdSettings.code, rdSettings.projection, rdSettings.transformation)

  crs.distance = L.CRS.Earth.distance
  crs.R = EARTH_RADIUS

  return crs
}

export const getRdObject = () => ({
  type: 'name',
  properties: {
    name: RD.code,
  },
})

export default getCrs
