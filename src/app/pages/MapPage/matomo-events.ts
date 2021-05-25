import type { TrackEventParams } from '@datapunt/matomo-tracker-react/lib/types'

const CATEGORY = 'kaart-2.0'

export const DRAWTOOL_REMOVE_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-verwijder-polygoon',
}

export const DRAWTOOL_ADD_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-nieuw-polygoon',
}

export const DRAWTOOL_EDIT_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-wijzig-polygoon',
}

export const DRAWTOOL_REMOVE_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-verwijder-lijn',
}

export const DRAWTOOL_ADD_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-nieuw-lijn',
}

export const DRAWTOOL_EDIT_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-wijzig-lijn',
}

export const BASE_LAYER_CHANGE: TrackEventParams = {
  category: CATEGORY,
  action: 'wijzig-ondergrond',
}

export const MARKER_SET: TrackEventParams = {
  category: CATEGORY,
  action: 'kaart-puntzoek',
}

export const PANORAMA_FULLSCREEN_TOGGLE: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-volledig-klik',
}

export const PANORAMA_CLOSE: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-sluit',
}

export const PANORAMA_SELECT: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-selecteer',
}

export const LEGEND_OPEN: TrackEventParams = {
  category: CATEGORY,
  action: 'legenda-open',
}

export const ZOOM_IN: TrackEventParams = {
  category: CATEGORY,
  action: 'zoom-in-knop',
}

export const ZOOM_OUT: TrackEventParams = {
  category: CATEGORY,
  action: 'zoom-uit-knop',
}
