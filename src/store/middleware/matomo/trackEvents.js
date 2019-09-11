import get from 'lodash.get'
import { routing } from '../../../app/routes'
import {
  getPage,
  isDataSelectionPage,
  isDatasetPage,
  isPanoPage,
} from '../../redux-first-router/selectors'
import {
  DOWNLOAD_DATASET_RESOURCE,
  FETCH_DATASETS_SUCCESS,
} from '../../../shared/ducks/datasets/data/data'
import {
  getNumberOfResults as getNumberOfDatasetsResults,
  getSearchText as getDatasetsSearchQuery,
} from '../../../shared/ducks/datasets/datasets'
import { DOWNLOAD_DATA_SELECTION } from '../../../shared/ducks/data-selection/constants'
import { FETCH_QUERY_SEARCH_RESULTS_SUCCESS } from '../../../shared/ducks/data-search/constants'
import { getNumberOfResults, getSearchQuery } from '../../../shared/ducks/data-search/selectors'
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS,
} from '../../../shared/ducks/user/user'
import { ADD_FILTER, REMOVE_FILTER } from '../../../shared/ducks/filters/filters'
import {
  getViewMode,
  HIDE_EMBED_PREVIEW,
  HIDE_PRINT,
  SET_VIEW_MODE,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  VIEW_MODE,
  SHARE_PAGE,
} from '../../../shared/ducks/ui/ui'
import {
  MAP_SET_DRAWING_MODE,
  SET_MAP_BASE_LAYER,
  SET_MAP_CLICK_LOCATION,
  TOGGLE_MAP_EMBED,
} from '../../../map/ducks/map/constants'
import { getShapeMarkers } from '../../../map/ducks/map/selectors'
import { getLabelObjectByTags } from '../../../panorama/ducks/selectors'
import {
  SHOW_MODAL,
  CLOSE_MODAL,
  NAVIGATE_HOME_REQUEST,
  REPORT_FEEDBACK_REQUEST,
  REPORT_PROBLEM_REQUEST,
} from '../../../header/ducks/actions'
import {
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  SET_PANORAMA_TAGS,
  CLOSE_PANORAMA,
  FETCH_PANORAMA_REQUEST_EXTERNAL,
} from '../../../panorama/ducks/constants'
import PAGES from '../../../app/pages'
import PARAMETERS from '../../parameters'
import { MATOMO_CONSTANTS } from './constants'
import { FETCH_ARTICLES_SUCCESS, FETCH_PUBLICATIONS_SUCCESS } from '../../../shared/ducks/cms'

const trackEvents = {
  // NAVIGATION
  // NAVIGATION -> NAVIGATE TO DATA DETAIL
  [routing.dataDetail.type]: function trackDataDetail({ firstAction, query, tracking, state }) {
    // eslint-disable-next-line no-nested-ternary
    return tracking && tracking.event === 'auto-suggest'
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'auto-suggest', // NAVIGATION -> SELECT AUTOSUGGEST OPTION
          tracking.category,
          tracking.query,
        ]
      : // eslint-disable-next-line no-nested-ternary
      getViewMode(state) === VIEW_MODE.MAP && get(query, `${PARAMETERS.VIEW}`) === undefined
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP
          'detail-volledig-weergeven',
          null,
        ]
      : // eslint-disable-next-line no-nested-ternary
      !firstAction &&
        getViewMode(state) === VIEW_MODE.SPLIT &&
        get(query, `${PARAMETERS.VIEW}`) === VIEW_MODE.MAP
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM SPLITSCREEN
          'detail-kaart-vergroten',
          null,
        ]
      : isPanoPage(state)
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'navigation', // NAVIGATION -> CLICK CLOSE FROM PANORAMA
          'panorama-verlaten',
          null,
        ]
      : []
  },
  // NAVIGATION -> CLICK CLOSE FROM PANORAMA
  [CLOSE_PANORAMA]: () => [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', 'panorama-verlaten', null],
  // NAVIGATION -> CLOSE PRINT VIEW
  [HIDE_PRINT]: () => [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', 'printversie-verlaten', null],
  // NAVIGATION -> CLOSE EMBED VIEW
  [HIDE_EMBED_PREVIEW]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'navigation',
    'embedversie-verlaten',
    null,
  ],
  // NAVIGATION -> CLICK LOGO
  [NAVIGATE_HOME_REQUEST]: ({ title }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'navigation',
    'home',
    title,
  ],
  // NAVIGATION -> TOGGLE FROM EMBEDDED MAP
  [TOGGLE_MAP_EMBED]: () => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'navigation',
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
          'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP Or SPLITSCREEN
          `georesultaten-${viewMode === VIEW_MODE.MAP ? 'volledig-weergeven' : 'kaart-vergroten'}`,
          null,
        ]

      case PAGES.PANORAMA: {
        let view = tracking
        if (typeof tracking === 'boolean') {
          view = viewMode === VIEW_MODE.MAP ? 'kaart-verkleinen' : 'kaart-vergroten'
        }
        return [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', `panorama-${view}`, null]
      }

      case PAGES.ADDRESSES:
      case PAGES.ESTABLISHMENTS:
      case PAGES.CADASTRAL_OBJECTS: {
        let view = tracking
        if (typeof tracking === 'boolean') {
          view = viewMode === VIEW_MODE.MAP ? 'kaart-verkleinen' : 'kaart-vergroten'
        }
        return [MATOMO_CONSTANTS.TRACK_EVENT, 'navigation', `dataselectie-${view}`, null]
      }

      default:
        return [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'navigation',
          `detail-${viewMode === VIEW_MODE.MAP ? 'volledig-weergeven' : 'kaart-vergroten'}`,
          null,
        ]
    }
  },
  // SITE SEARCH
  // SITE SEARCH -> DATA SWITCH TAB
  [routing.dataSearchQuery.type]: ({ firstAction = null, query, state }) => {
    const searchQuery = getSearchQuery(state)
    const numberOfResults = getNumberOfResults(state)
    return firstAction && (searchQuery && searchQuery.length > 0) && query.term === searchQuery
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, searchQuery, 'data', numberOfResults]
      : []
  },
  // SITE SEARCH -> DATA INITIAL LOAD
  [FETCH_QUERY_SEARCH_RESULTS_SUCCESS]: function trackDataSearch({ tracking, state }) {
    return getPage(state) === PAGES.DATA_SEARCH_QUERY
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, tracking.query, 'data', tracking.numberOfResults]
      : []
  },
  // SITE SEARCH -> DATASETS SWITCH TAB
  [routing.datasetSearch.type]: ({ firstAction = null, query, state }) => {
    const searchQuery = getDatasetsSearchQuery(state)
    const numberOfResults = getNumberOfDatasetsResults(state)
    return firstAction && (searchQuery && searchQuery.length > 0) && query.term === searchQuery
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, searchQuery, 'datasets', numberOfResults]
      : []
  },
  // SITE SEARCH -> DATASETS INITIAL LOAD
  [FETCH_DATASETS_SUCCESS]: function trackDatasetSearch({ tracking, state }) {
    return getPage(state) === PAGES.DATASET_SEARCH
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, tracking.query, 'datasets', tracking.numberOfResults]
      : []
  },

  // SITE SEARCH -> ARTICLES SWITCH TAB
  [routing.articleSearch.type]: ({ firstAction = null, query }) => {
    // TODO DP-7130
    const searchQuery = 'articleSearch'
    const numberOfResults = 0
    return firstAction && (searchQuery && searchQuery.length > 0) && query.term === searchQuery
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, searchQuery, 'articles', numberOfResults]
      : []
  },
  // SITE SEARCH -> ARTICLES INITIAL LOAD
  [FETCH_ARTICLES_SUCCESS]: function trackDatasetSearch({ tracking, state }) {
    return getPage(state) === PAGES.ARTICLE_SEARCH
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, tracking.query, 'articles', tracking.numberOfResults]
      : []
  },
  // SITE SEARCH -> PUBLICATIONS SWITCH TAB
  [routing.publicationSearch.type]: ({ firstAction = null, query }) => {
    // TODO DP-7130
    const searchQuery = 'publicationSearch'
    const numberOfResults = 0
    return firstAction && (searchQuery && searchQuery.length > 0) && query.term === searchQuery
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, searchQuery, 'publications', numberOfResults]
      : []
  },
  // SITE SEARCH -> PUBLICATIONS INITIAL LOAD
  [FETCH_PUBLICATIONS_SUCCESS]: function trackDatasetSearch({ tracking, state }) {
    return getPage(state) === PAGES.PUBLICATION_SEARCH
      ? [MATOMO_CONSTANTS.TRACK_SEARCH, tracking.query, 'publications', tracking.numberOfResults]
      : []
  },
  // DATASETS
  // DATASETS -> CLICK RESOURCE ON DATASET_DETAIL
  [DOWNLOAD_DATASET_RESOURCE]: ({ tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'Download',
    tracking.dataset,
    tracking.resourceUrl,
  ],
  // DATA SELECTION
  // DATA SELECTION -> BUTTON "downloaden"
  [DOWNLOAD_DATA_SELECTION]: ({ tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'Download-tabel',
    `dataselectie-download-${tracking.toLowerCase()}`,
    null,
  ],
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
  // MAP -> TOGGLE OVERLAYS
  TOGGLE_MAP_OVERLAY: ({ tracking }) =>
    tracking.category
      ? [
          MATOMO_CONSTANTS.TRACK_EVENT,
          'kaartlaag',
          tracking.category.toLowerCase().replace(/[: ][ ]*/g, '_'),
          tracking.title,
        ]
      : [],
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
    const { layerId } = getLabelObjectByTags(tracking)
    const set = tracking.length > 1 ? layerId.replace('pano', '') : 'recent'

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
  // MENU -> TOGGLE MODAL ON
  [SHOW_MODAL]: ({ title }) => [MATOMO_CONSTANTS.TRACK_EVENT, 'feedback', 'feedback-menu', title],
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
