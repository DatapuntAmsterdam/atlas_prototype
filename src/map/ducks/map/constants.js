export const REDUCER_KEY = 'map'
export const MAP_BOUNDING_BOX = 'MAP_BOUNDING_BOX'
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY'
export const MAP_END_DRAWING = 'MAP_END_DRAWING'
export const MAP_PAN = 'MAP_PAN'
export const MAP_SET_DRAWING_MODE = 'MAP_SET_DRAWING_MODE'
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE'
export const MAP_ZOOM = 'MAP_ZOOM'
export const MAP_CLEAR = 'MAP_CLEAR'
export const SET_MAP_BASE_LAYER = 'SET_MAP_BASE_LAYER'
export const TOGGLE_MAP_OVERLAY = 'TOGGLE_MAP_OVERLAY'
export const TOGGLE_MAP_OVERLAY_VISIBILITY = 'TOGGLE_MAP_OVERLAY_VISIBILITY'
export const SET_MAP_CLICK_LOCATION = 'SET_MAP_CLICK_LOCATION'
export const TOGGLE_MAP_PANEL = 'TOGGLE_MAP_PANEL'
export const CLOSE_MAP_PANEL = 'CLOSE_MAP_PANEL'
export const MAP_LOADING = 'MAP_LOADING'
export const TOGGLE_MAP_EMBED = 'TOGGLE_MAP_EMBED'

export const DEFAULT_LAT = 52.3731081
export const DEFAULT_LNG = 4.8932945
export const PANORAMA = 'pano'
export const MARKER_ICON = 'default'

export const initialState = {
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  baseLayer: 'topografie',
  zoom: 11,
  overlays: [],
  isLoading: false,
  drawingMode: 'none',
  shapeMarkers: 0,
  shapeDistanceTxt: '',
  shapeAreaTxt: '',
  mapPanelActive: false,
  marker: null,
  markerIcon: MARKER_ICON,
}
export const geoSearchType = 'geoSearchType'
export const dataSelectionType = 'dataSelectionType'
export const detailPointType = 'detailPointType'
export const panoramaPersonType = 'panoramaPersonType'
export const panoramaOrientationType = 'panoramaOrientationType'
export const markerPointType = 'markerPointType'
