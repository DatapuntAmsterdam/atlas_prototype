import { LatLngLiteral, LatLngTuple } from 'leaflet'
import { constants } from '@datapunt/arm-core'
import { UrlParam } from './utils/useParam'
import { normalizeCoordinate } from '../shared/services/coordinate-reference-system'

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

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

export const centerParam: UrlParam<LatLngTuple> = {
  name: 'center',
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.center as LatLngTuple,
  decode: (val) =>
    val.split(',').map((ltLng) => normalizeCoordinate(parseFloat(ltLng), 7)) as LatLngTuple,
  encode: (selectorResult) =>
    selectorResult.map((coordinate) => normalizeCoordinate(coordinate, 7)).join(','),
}

export const zoomParam: UrlParam<number> = {
  name: 'zoom',
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom as number,
  decode: (val) => parseInt(val, 10),
  encode: (val) => val.toString(),
}

export const locationParam: UrlParam<LatLngTuple | null> = {
  name: 'locatie',
  defaultValue: null,
  decode: (val) =>
    val.split(',').map((ltLng) => normalizeCoordinate(parseFloat(ltLng), 7)) as LatLngTuple,
  encode: (selectorResult) =>
    selectorResult
      ? selectorResult.map((coordinate) => normalizeCoordinate(coordinate, 7)).join(',')
      : null,
}

export type PolyDrawing = { id: string; polygon: LatLngLiteral[] }
export type MapLayer = { id: string; isVisible: boolean }

export const polygonParam: UrlParam<PolyDrawing[] | null> = {
  name: 'polygonen',
  defaultValue: null,
  decode: (val) => JSON.parse(val),
  encode: (val) => (val?.length ? JSON.stringify(val) : null),
}

export const polylineParam: UrlParam<PolyDrawing[] | null> = {
  name: 'meten',
  defaultValue: null,
  decode: (val) => JSON.parse(val),
  encode: (val) => (val?.length ? JSON.stringify(val) : null),
}

export const mapLayersParam: UrlParam<string[] | null> = {
  name: 'lagen',
  defaultValue: null,
  decode: (val) => val.split('_'),
  encode: (val) => (val?.length ? val.join('_') : null),
}

export const legendOpenParam: UrlParam<boolean> = {
  name: 'legenda',
  defaultValue: false,
  decode: (val) => Boolean(val),
  encode: (val) => val.toString(),
}

export const baseLayerParam: UrlParam<BaseLayer> = {
  name: 'achtergrond',
  defaultValue: 'topografie',
  decode: (val) => val as BaseLayer,
  encode: (val) => val.toString(),
}
