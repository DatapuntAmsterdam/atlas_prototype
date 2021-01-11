/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  cs_external_id: string
  wkb_geometry: Geometry
  street: string
  housenumber: string
  housnumberext: any
  postalcode: string
  district: any
  countryiso: string
  region: any
  city: string
  provider: string
  restrictionsremark: any
  charging_point: number
  connector_type: string
  vehicle_type: string
  charging_capability: string
  identification_type: string
  last_update: string
  last_status_update: string
  charging_cap_max: number
  name: string
}
