import { LatLngTuple } from 'leaflet'

export enum SnapPoint {
  Full,
  Halfway,
  Closed,
}

export enum Overlay {
  Results,
  Legend,
  None,
}

export type MarkerGroup = {
  id: string
  markers: LatLngTuple[]
}
