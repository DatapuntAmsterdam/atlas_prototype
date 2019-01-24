import { routing } from '../../../app/routes';
import {
  getPage,
  isDataSelectionPage,
  isDatasetPage,
  isPanoPage
} from '../../redux-first-router/selectors';
import { DOWNLOAD_DATASET_RESOURCE } from '../../../shared/ducks/datasets/data/data';
import {
  DOWNLOAD_DATA_SELECTION,
  END_DATA_SELECTION,
  SET_GEOMETRY_FILTER
} from '../../../shared/ducks/data-selection/constants';
import {
  FETCH_QUERY_SEARCH_RESULTS_SUCCESS
} from '../../../shared/ducks/data-search/constants';
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS
} from '../../../shared/ducks/user/user';
import { ADD_FILTER, REMOVE_FILTER } from '../../../shared/ducks/filters/filters';
import {
  getViewMode,
  SET_VIEW_MODE,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  VIEW_MODE
} from '../../../shared/ducks/ui/ui';
import { SET_MAP_BASE_LAYER, SET_MAP_CLICK_LOCATION } from '../../../map/ducks/map/map';
import { NAVIGATE_HOME_REQUEST, REPORT_PROBLEM_REQUEST } from '../../../header/ducks/actions';
import {
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  FETCH_PANORAMA_REQUEST_EXTERNAL
} from '../../../panorama/ducks/constants';
import PAGES from '../../../app/pages';

const PIWIK_CONSTANTS = {
  TRACK_EVENT: 'trackEvent',
  TRACK_SEARCH: 'trackSiteSearch'

};

const events = {
  // NAVIGATION
  // NAVIGATION -> SELECT AUTOSUGGEST OPTION
  [routing.dataDetail.type]: function trackDataDetail({ tracking, state }) {
    return (tracking && tracking.event === 'auto-suggest') ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'auto-suggest',
      tracking.category,
      tracking.query
    ] : [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation',
      isPanoPage(state) ? 'panorama-verlaten' : 'detail-volledig-weergeven',
      null
    ];
  },
  // NAVIGATION -> CLICK LOGO
  [NAVIGATE_HOME_REQUEST]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'home',
    title
  ],
  // NAVIGATION -> CHANGE VIEW MODE
  [SET_VIEW_MODE]: ({ tracking, state }) => {
    const viewMode = getViewMode(state);
    switch (getPage(state)) {
      case PAGES.DATA_GEO_SEARCH:
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `georesultaten-${(viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten'}`,
          null
        ];

      case PAGES.DATA_DETAIL:
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `detail-${(viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten'}`,
          null
        ];

      case PAGES.PANORAMA: {
        let view = tracking;
        if (typeof tracking === 'boolean') {
          view = (viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten';
        }
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `panorama-${view}`,
          null
        ];
      }

      case PAGES.ADDRESSES:
      case PAGES.ESTABLISHMENTS:
      case PAGES.CADASTRAL_OBJECTS: {
        let view = tracking;
        if (typeof tracking === 'boolean') {
          view = (viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten';
        }
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `dataselectie-${view}`,
          null
        ];
      }

      default:
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `page-${(viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten'}`,
          null
        ];
    }
  },
  // SITE SEARCH
  // SITE SEARCH -> DATA
  [FETCH_QUERY_SEARCH_RESULTS_SUCCESS]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_SEARCH,
    'Data',
    tracking.query,
    tracking.numberOfResults
  ],
  // DATASET
  [DOWNLOAD_DATASET_RESOURCE]: ({ dataset, resourceUrl }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download',
    dataset,
    resourceUrl
  ],
  // DATA SELECTION
  // DATA SELECTION -> BUTTON "downloaden"
  [DOWNLOAD_DATA_SELECTION]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download-tabel',
    `dataselectie-download-${tracking.toLowerCase()}`,
    null
  ],
  // DATA SELECTION -> DRAW "polygoon"
  [SET_GEOMETRY_FILTER]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'filter',
    'dataselectie-polygoon-filter',
    'Locatie ingetekend'
  ],
  // MAP
  // MAP -> SHOW EMBEDDED
  [routing.data.type]: function trackEmbed({ query, href }) {
    return (query.embed) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'embed',
      'embedkaart',
      href
    ] : [];
  },
  // MAP -> DRAW "line"
  [END_DATA_SELECTION]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'kaart',
    'kaart-tekenlijn',
    title
  ],
  [SET_MAP_BASE_LAYER]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'achtergrond',
    (tracking.startsWith('lf') ? 'luchtfoto' : 'topografie'),
    tracking
  ],
  // MAP -> CLICK LOCATION
  [SET_MAP_CLICK_LOCATION]: function trackMapClick({ state }) {
    return isPanoPage(state) ? [   // PANORAMA -> CLICK MAP
      PIWIK_CONSTANTS.TRACK_EVENT,
      'panorama-navigatie',
      'panorama-kaart-klik',
      null
    ] : [ // GEOSEARCH -> CLICK MAP
      PIWIK_CONSTANTS.TRACK_EVENT,
      'kaart',
      'kaart-puntzoek',
      null
    ];
  },
  TOGGLE_MAP_OVERLAY: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'kaartlaag',
    tracking.category.toLowerCase().replace(/[: ][ ]*/g, '_'),
    tracking.title
  ],
  // AUTHENTICATION
  // AUTHENTICATION BUTTON -> "inloggen" / "uitloggen"
  [AUTHENTICATE_USER_REQUEST]: ({ tracking, title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    tracking,
    title
  ],
  // AUTHENTICATION AFTER RETURN
  [AUTHENTICATE_USER_SUCCESS]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    'ingelogd',
    tracking
  ],
  // FILTERS
  // ADD FILTER -> "datasets" / "dataselectie"
  [ADD_FILTER]: ({ tracking, state }) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
        : null;

    return page ? ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-tabel-filter`,
      Object.keys(tracking)[0]
    ]) : [];
  },
  // REMOVE FILTER -> "datasets" / "dataselectie"
  [REMOVE_FILTER]: ({ tracking, state }) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
        : null;

    return page ? ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-tabel-filter-verwijder`,
      tracking
    ]) : [];
  },
  // PANORAMA
  // PANORAMA -> TOGGLE "missionType" / "missionYear"
  [FETCH_PANORAMA_REQUEST_TOGGLE]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    (tracking.year > 0) ? `panorama-set-${tracking.year}${tracking.missionType}` : 'panorama-set-recent',
    null
  ],
  // PANORAMA -> TOGGLE "external"
  [FETCH_PANORAMA_REQUEST_EXTERNAL]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    'panorama-set-google',
    null
  ],
  // PANORAMA -> CLICK HOTSPOT
  [FETCH_PANORAMA_HOTSPOT_REQUEST]: () => ([
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-navigation',
    'panorama-hotspot-klik',
    null
  ]),
  // MENU
  // MENU -> "terugmelden"
  [REPORT_PROBLEM_REQUEST]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-terugmelden',
    title
  ],
  // MENU
  // MENU -> "embedden"
  [SHOW_EMBED_PREVIEW]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-embedversie',
    title
  ],
  // MENU
  // MENU -> "printen"
  [SHOW_PRINT]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-printversie',
    title
  ]
};

export default events;
