export interface GeoSearchFeature {
  hoofdadres?: string
  vbo_status?: string
  type_adres?: string
  properties: {
    display: string
    distance: number
    id: string
    type: string
    uri: string
    opr_type?: string
    parent?: string
  }
}
export interface GeoSearch {
  type: 'FeatureCollection'
  features: GeoSearchFeature[]
}
