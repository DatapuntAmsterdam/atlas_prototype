export interface GeoSearchProperties {
  display: string
  distance: number
  id: string
  type: string
  uri: string
  opr_type?: string
  parent?: string
}

export interface GeoSearchFeature {
  hoofdadres?: string
  vbo_status?: string
  type_adres?: string
  properties: GeoSearchProperties
}
export interface GeoSearch {
  type: 'FeatureCollection'
  features: GeoSearchFeature[]
}
