/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  vhe_id: string
  object_id: string
  status: string
  portefeuille: string
  grex: string
  object_type: string
  object_naam: string
  monumental_status?: string
  vhe_adres: string
  object_eigendomsstatus: string
  vhe_eigendomsstatus: string
  bouwjaar: number
  oppervlakte: number
  huurtype: string
  bag_pand_id: string
  monumentstatus: any
  bag_pand_geometrie: Geometry
  bag_verblijfsobject_id: string
  bag_verblijfsobject_geometrie: Geometry
  bag_verblijfsobject_gebruiksdoelen: string
}
