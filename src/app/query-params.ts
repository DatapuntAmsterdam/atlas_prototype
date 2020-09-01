import { constants } from '@datapunt/arm-core'
import { LatLngLiteral, LatLngTuple } from 'leaflet'
import { normalizeCoordinate } from '../shared/services/coordinate-reference-system'
import { UrlParam } from './utils/useParam'

// TODO: Refactor this default export once this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

export type BaseLayer =
  | 'topografie'
  | 'topo_rd_light'
  | 'topo_rd_zw'
  | 'lf2019'
  | 'lf2018'
  | 'ir2018'
  | 'lf2017'
  | 'lf2016'
  | 'lf2015'
  | 'lf2014'
  | 'lf2013'
  | 'lf2012'
  | 'lf2011'
  | 'lf2010'
  | 'lf2009'
  | 'lf2008'
  | 'lf2007'
  | 'lf2006'
  | 'lf2005'
  | 'lf2004'
  | 'lf2003'

export interface PolyDrawing {
  id: string
  polygon: LatLngLiteral[]
}

export interface MapLayer {
  id: string
  isVisible: boolean
}

const COORDINATE_PRECISION = 7

export const centerParam: UrlParam<LatLngTuple> = {
  name: 'center',
  // TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.center as LatLngTuple,
  decode: (value) => value.split(',').map((ltLng) => parseFloat(ltLng)) as LatLngTuple,
  encode: (value) =>
    value.map((coordinate) => normalizeCoordinate(coordinate, COORDINATE_PRECISION)).join(','),
}

export const zoomParam: UrlParam<number> = {
  name: 'zoom',
  // TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom as number,
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toString(),
}

export const locationParam: UrlParam<LatLngTuple | null> = {
  name: 'locatie',
  defaultValue: null,
  decode: (value) => value.split(',').map((ltLng) => parseFloat(ltLng)) as LatLngTuple,
  encode: (value) =>
    value
      ? value.map((coordinate) => normalizeCoordinate(coordinate, COORDINATE_PRECISION)).join(',')
      : null,
}

export const polygonParam: UrlParam<PolyDrawing[]> = {
  name: 'polygonen',
  defaultValue: [],
  decode: (value) => JSON.parse(value),
  encode: (value) => (value.length > 0 ? JSON.stringify(value) : null),
}

export const polylineParam: UrlParam<PolyDrawing[]> = {
  name: 'meten',
  defaultValue: [],
  decode: (value) => JSON.parse(value),
  encode: (value) => (value.length > 0 ? JSON.stringify(value) : null),
}

export const mapLayersParam: UrlParam<string[]> = {
  name: 'lagen',
  defaultValue: [],
  decode: (value) => value.split('_'),
  encode: (value) => value.join('_'),
}

export const legendOpenParam: UrlParam<boolean> = {
  name: 'legenda',
  defaultValue: false,
  decode: (value) => Boolean(value),
  encode: (value) => value.toString(),
}

export const baseLayerParam: UrlParam<BaseLayer> = {
  name: 'achtergrond',
  defaultValue: 'topografie',
  decode: (value) => value as BaseLayer,
  encode: (value) => value,
}

export const detailUrlParam: UrlParam<string | null> = {
  name: 'detailUrl',
  defaultValue: null,
  decode: (value) => value,
  encode: (value) => value,
}
