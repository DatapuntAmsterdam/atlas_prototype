import { Polygon, Polyline } from 'leaflet'

interface ExtraLayerTypes {
  id: string
  editing: {
    _enabled: boolean
    disable: () => void
    enable: () => void
  }
}

export type PolygonType = ExtraLayerTypes & Polygon
export type PolylineType = ExtraLayerTypes & Polyline

export type ExtendedLayer = PolygonType | PolylineType
