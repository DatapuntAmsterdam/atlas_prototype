/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { SmallAPIReference, APIReference } from '../../../types'

export interface Root extends APIReference {
  pandidentificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  bbox: number[]
  geometrie: Geometry
  oorspronkelijk_bouwjaar: string
  bouwlagen: any
  hoogste_bouwlaag: any
  laagste_bouwlaag: any
  pandnaam: any
  ligging: string
  type_woonobject: string | null
  verblijfsobjecten: SmallAPIReference
  _adressen: SmallAPIReference
  _monumenten: SmallAPIReference
  bouwblok: APIReference
  begin_geldigheid: string
  einde_geldigheid: any
  _buurt: APIReference
  _buurtcombinatie: APIReference
  _stadsdeel: APIReference
  _gemeente: APIReference
}
