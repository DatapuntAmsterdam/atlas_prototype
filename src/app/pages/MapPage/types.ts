import { LatLngTuple } from 'leaflet'

export enum SnapPoint {
  Full,
  Halfway,
  Closed,
}

export type MarkerGroup = {
  id: string
  markers: LatLngTuple[]
}
