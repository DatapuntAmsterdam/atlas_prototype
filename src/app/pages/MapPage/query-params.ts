import { constants } from '@datapunt/arm-core'
import { LatLngLiteral, LatLngTuple } from 'leaflet'
import { normalizeCoordinate } from '../../../shared/services/coordinate-reference-system'
import { UrlParam } from '../../utils/useParam'
import { PANO_LABELS } from '../../../panorama/ducks/constants'

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

function encodeLatLngLiteral(value: LatLngLiteral) {
  return [value.lat, value.lng]
    .map((coordinate) => normalizeCoordinate(coordinate, COORDINATE_PRECISION))
    .join(',')
}

function decodeLatLngLiteral(value: string): LatLngLiteral {
  const [lat, lng] = value.split(',').map((part) => parseFloat(part))

  return {
    lat,
    lng,
  }
}

// TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
const defaultCenter = DEFAULT_AMSTERDAM_MAPS_OPTIONS.center as LatLngTuple

export const centerParam: UrlParam<LatLngLiteral> = {
  name: 'center',
  defaultValue: { lat: defaultCenter[0], lng: defaultCenter[1] },
  decode: decodeLatLngLiteral,
  encode: encodeLatLngLiteral,
}

export const zoomParam: UrlParam<number> = {
  name: 'zoom',
  // TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom as number,
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toString(),
}

export const locationParam: UrlParam<LatLngLiteral | null> = {
  name: 'locatie',
  defaultValue: null,
  decode: decodeLatLngLiteral,
  encode: (value) => (value ? encodeLatLngLiteral(value) : null),
}

function encodePolyDrawing(value: PolyDrawing[]) {
  return value.length > 0 ? JSON.stringify(value) : null
}

function decodePolyDrawing(value: string) {
  return JSON.parse(value)
}

export const polygonsParam: UrlParam<PolyDrawing[]> = {
  name: 'polygonen',
  defaultValue: [],
  decode: decodePolyDrawing,
  encode: encodePolyDrawing,
}

export const polylinesParam: UrlParam<PolyDrawing[]> = {
  name: 'meten',
  defaultValue: [],
  decode: decodePolyDrawing,
  encode: encodePolyDrawing,
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

export type PanoParam = {
  heading: number
  pitch: number
  fov: number
} | null

export const panoViewerSettingsParam: UrlParam<PanoParam> = {
  name: 'pano',
  defaultValue: null,
  decode: (value) => value && JSON.parse(value),
  encode: (value) => value && JSON.stringify(value),
}

export const panoTagIdParam: UrlParam<string> = {
  name: 'panoTag',
  defaultValue: PANO_LABELS[0].id,
  decode: (value) => value,
  encode: (value) => value,
}

export const panoFullScreenParam: UrlParam<boolean> = {
  name: 'panoFullScreen',
  defaultValue: false,
  decode: (value) => Boolean(value),
  encode: (value) => value.toString(),
}
