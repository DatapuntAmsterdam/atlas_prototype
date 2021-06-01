import type { LatLngTuple } from 'leaflet'

export enum SnapPoint {
  Full,
  Halfway,
  Closed,
}

export interface MarkerGroup {
  id: string
  markers: LatLngTuple[]
}
