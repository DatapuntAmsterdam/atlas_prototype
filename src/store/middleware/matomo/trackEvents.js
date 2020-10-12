import { MATOMO_CONSTANTS } from '../../../app/matomo'
import PAGES from '../../../app/pages'
import { routing } from '../../../app/routes'
import {
  CLOSE_MODAL,
  REPORT_FEEDBACK_REQUEST,
  REPORT_PROBLEM_REQUEST,
} from '../../../header/ducks/actions'
import {
  MAP_SET_DRAWING_MODE,
  SET_MAP_BASE_LAYER,
  SET_MAP_CLICK_LOCATION,
  TOGGLE_MAP_EMBED,
} from '../../../map/ducks/map/constants'
import { getShapeMarkers } from '../../../map/ducks/map/selectors'
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST_EXTERNAL,
  SET_PANORAMA_TAGS,
} from '../../../panorama/ducks/constants'
import { getLabelObjectByTags } from '../../../panorama/ducks/selectors'
import { ADD_FILTER, REMOVE_FILTER } from '../../../shared/ducks/filters/filters'
import {
  getViewMode,
  HIDE_EMBED_PREVIEW,
  HIDE_PRINT,
  SET_VIEW_MODE,
  SHARE_PAGE,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  VIEW_MODE,
} from '../../../shared/ducks/ui/ui'
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS,
} from '../../../shared/ducks/user/user'
import PARAMETERS from '../../parameters'
import {
  getPage,
  isDataSelectionPage,
  isDatasetPage,
  isPanoPage,
} from '../../redux-first-router/selectors'

export const TRACK_ACTION_NAVIGATION = 'navigation'
export const TRACK_CATEGORY_AUTO_SUGGEST = 'auto-suggest'
export const TRACK_NAME_ENLARGE_DETAIL_MAP = 'detail-kaart-vergroten'
export const TRACK_NAME_FULL_DETAIL = 'detail-volledig-weergeven'
export const TRACK_NAME_LEAVE_PANO = 'panorama-verlaten'

/* istanbul ignore next */
const trackEvents = {
  // NAVIGATION
  // NAVIGATION -> NAVIGATE TO DATA DETAIL
  [routing.dataDetail.type]: function trackDataDetail({ isFirstAction, query, tracking, state }) {
    if (tracking?.event === 'auto-suggest') {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'auto-suggest', // NAVIGATION -> SELECT AUTOSUGGEST OPTION
        tracking.category,
        tracking.query,
      ]
    }

    const viewMode = getViewMode(state)

    if (viewMode === VIEW_MODE.MAP && query?.[PARAMETERS.VIEW] === undefined) {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP
        'detail-volledig-weergeven',
        null,
      ]
    }

    if (
      !isFirstAction &&
      viewMode === VIEW_MODE.SPLIT &&
      query?.[PARAMETERS.VIEW] === VIEW_MODE.MAP
    ) {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM SPLITSCREEN
        'detail-kaart-vergroten',
        null,
      ]
    }

    if (isPanoPage(state)) {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'navigation', // NAVIGATION -> CLICK CLOSE FROM PANORAMA
        'panorama-verlaten',
        null,
      ]
    }

    return []
  },
  // NAVIGATION -> CLICK CLOSE FROM PANORAMA
  [CLOSE_PANORAMA]: () => [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', 'panorama-verlaten', null],
  // NAVIGATION -> CLOSE PRINT VIEW
  [HIDE_PRINT]: () => [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', 'printversie-verlaten', null],
  // NAVIGATION -> CLOSE EMBED VIEW
  [HIDE_EMBED_PREVIEW]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    TRACK_ACTION_NAVIGATION,
    'embedversie-verlaten',
    null,
  ],
  // NAVIGATION -> TOGGLE FROM EMBEDDED MAP
  [TOGGLE_MAP_EMBED]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    TRACK_ACTION_NAVIGATION,
    'embedkaart-naar-portaal',
    null,
  ],
  // NAVIGATION -> CHANGE VIEW MODE
  [SET_VIEW_MODE]: ({ tracking, state }) => {
    const viewMode = getViewMode(state)
    switch (getPage(state)) {
      case PAGES.DATA_SEARCH_GEO:
        return [
          MATOMO_CONSTANTS.TRACK_EVENT,
          TRACK_ACTION_NAVIGATION, // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP Or SPLITSCREEN
          `georesultaten-${viewMode === VIEW_MODE.MAP ? 'volledig-weergeven' : 'kaart-vergroten'}`,
          null,
        ]

      case PAGES.PANORAMA: {
        let view = tracking
        if (typeof tracking === 'boolean') {
          view = viewMode === VIEW_MODE.MAP ? 'kaart-verkleinen' : 'kaart-vergroten'
        }
        return [MATOMO_CONSTANTS.TRACK_EVENT, TRACK_ACTION_NAVIGATION, `panorama-${view}`, null]
      }

      case PAGES.ADDRESSES:
      case PAGES.ESTABLISHMENTS:
      case PAGES.CADASTRAL_OBJECTS: {
        let view = tracking
        if (typeof tracking === 'boolean') {
          view = viewMode === VIEW_MODE.MAP ? 'kaart-verkleinen' : 'kaart-vergroten'
        }
        return [MATOMO_CONSTANTS.TRACK_EVENT, TRACK_ACTION_NAVIGATION, `dataselectie-${view}`, null]
      }

      default:
        return [
          MATOMO_CONSTANTS.TRACK_EVENT,
          TRACK_ACTION_NAVIGATION,
          `detail-${viewMode === VIEW_MODE.MAP ? 'volledig-weergeven' : 'kaart-vergroten'}`,
          null,
        ]
    }
  },
  // DRAW TOOL
  [MAP_SET_DRAWING_MODE]: function trackDrawing({ tracking, state, title }) {
    const markers = getShapeMarkers(state)
    // eslint-disable-next-line no-nested-ternary
    return tracking === 'none' && markers === 2
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'kaart', // DRAW TOOL -> DRAW "line"
          'kaart-tekenlijn',
          title,
        ]
      : tracking === 'none' && markers > 2
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'filter', // DRAW TOOL -> DRAW "polygoon"
          'dataselectie-polygoon-filter',
          'Locatie ingetekend',
        ]
      : []
  },
  // MAP
  // MAP -> TOGGLE BASE LAYER
  [SET_MAP_BASE_LAYER]: ({ tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'achtergrond',
    tracking.startsWith('lf') ? 'luchtfoto' : 'topografie',
    tracking,
  ],
  // MAP -> CLICK LOCATION
  [SET_MAP_CLICK_LOCATION]: function trackMapClick({ state }) {
    return isPanoPage(state)
      ? [
          // PANORAMA -> CLICK MAP
          MATOMO_CONSTANTS.TRACK_EVENT,
          'panorama-navigatie',
          'panorama-kaart-klik',
          null,
        ]
      : [
          // GEOSEARCH -> CLICK MAP
          MATOMO_CONSTANTS.TRACK_EVENT,
          'kaart',
          'kaart-puntzoek',
          null,
        ]
  },
  // AUTHENTICATION
  // AUTHENTICATION BUTTON -> "inloggen" / "uitloggen"
  [AUTHENTICATE_USER_REQUEST]: ({ tracking, title }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'login',
    tracking,
    title,
  ],
  // AUTHENTICATION AFTER RETURN
  [AUTHENTICATE_USER_SUCCESS]: ({ tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'login',
    'ingelogd',
    tracking,
  ],
  // FILTERS
  // ADD FILTER -> "datasets" / "dataselectie"
  [ADD_FILTER]: ({ tracking, state }) => {
    // eslint-disable-next-line no-nested-ternary
    const page = isDataSelectionPage(state)
      ? 'dataselectie-tabel'
      : isDatasetPage(state)
      ? 'datasets'
      : null

    return page
      ? [MATOMO_CONSTANTS.TRACK_EVENT, 'filter', `${page}-filter`, Object.keys(tracking)[0]]
      : []
  },
  // REMOVE FILTER -> "datasets" / "dataselectie"
  [REMOVE_FILTER]: ({ tracking, state }) => {
    // eslint-disable-next-line no-nested-ternary
    const page = isDataSelectionPage(state)
      ? 'dataselectie'
      : isDatasetPage(state)
      ? 'dataset'
      : null

    return page
      ? [MATOMO_CONSTANTS.TRACK_EVENT, 'filter', `${page}-tabel-filter-verwijder`, tracking]
      : []
  },
  // PANORAMA
  // PANORAMA -> TOGGLE "missionType" / "missionYear"
  [SET_PANORAMA_TAGS]: function trackPanoramaTags({ tracking }) {
    const { id } = getLabelObjectByTags(tracking)
    const set = tracking.length > 1 ? id.replace('pano', '') : 'recent'

    return [MATOMO_CONSTANTS.TRACK_EVENT, 'panorama-set', `panorama-set-${set}`, null]
  },
  // PANORAMA -> TOGGLE "external"
  [FETCH_PANORAMA_REQUEST_EXTERNAL]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    'panorama-set-google',
    null,
  ],
  // PANORAMA -> CLICK HOTSPOT
  [FETCH_PANORAMA_HOTSPOT_REQUEST]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'panorama-navigatie',
    'panorama-hotspot-klik',
    null,
  ],
  // MENU
  // MENU -> TOGGLE MODAL OFF
  [CLOSE_MODAL]: () => [MATOMO_CONSTANTS.TRACK_EVENT, 'feedback', 'feedback-verlaten', null],
  // MENU -> "terugmelden"
  [REPORT_FEEDBACK_REQUEST]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'feedback',
    'feedback-terugmelden',
    null,
  ],
  // MENU -> "probleem"
  [REPORT_PROBLEM_REQUEST]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'feedback',
    'feedback-probleem',
    null,
  ],
  // MENU -> "embedden"
  [SHOW_EMBED_PREVIEW]: ({ title }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-embedversie',
    title,
  ],
  // MENU -> "printen"
  [SHOW_PRINT]: ({ title }) => [MATOMO_CONSTANTS.TRACK_EVENT, 'menu', 'menu-printversie', title],
  // MENU SHARE -> "bottomPage"
  [SHARE_PAGE]: ({ title, tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'menu',
    `menu-delen-${tracking}`,
    title,
  ],
  // NOT FOUND
  '@@redux-first-router/NOT_FOUND': ({ state }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'niet-gevonden',
    state.location.pathname,
    null,
  ],
}

export default trackEvents
