import { routing } from '../../../app/routes';
import {
  isDatasetPage,
  isDataSelectionPage,
  isPanoPage,
  getView
} from '../../redux-first-router/selectors';
import { DOWNLOAD_DATASET_RESOURCE } from '../../../shared/ducks/datasets/data/data';
import {
  DOWNLOAD_DATA_SELECTION,
  SET_GEOMETRY_FILTER,
  SET_VIEW as SET_DATA_SELECTION_VIEW,
  VIEWS as DATA_SELECTION_VIEWS
} from '../../../shared/ducks/data-selection/constants';
import { SET_VIEW as SET_DETAIL_VIEW } from '../../../shared/ducks/detail/constants';
import { SET_VIEW as SET_GEOSEARCH_VIEW } from '../../../shared/ducks/data-search/constants';
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS
} from '../../../shared/ducks/user/user';
import {
  ADD_FILTER,
  REMOVE_FILTER
} from '../../../shared/ducks/filters/filters';
import {
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT
} from '../../../shared/ducks/ui/ui';
import {
  SET_MAP_BASE_LAYER,
  SET_MAP_CLICK_LOCATION
} from '../../../map/ducks/map/map';
import {
  NAVIGATE_HOME_REQUEST,
  REPORT_PROBLEM_REQUEST
} from '../../../header/ducks/actions';
import {
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_VIEW,
  VIEWS as PANORAMA_VIEWS
} from '../../../panorama/ducks/constants';

const PIWIK_CONSTANTS = {
  TRACK_EVENT: 'trackEvent'
};

const events = {
  // NAVIGATION
  [routing.dataGeoSearch.type]: (tracking, state) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    isPanoPage(state) ? 'panorama-verlaten' : 'georesultaten-volledig-weergeven',
    null
  ],
  [routing.dataDetail.type]: (tracking, state) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    isPanoPage(state) ? 'panorama-verlaten' : 'detail-volledig-weergeven',
    null
  ],
  [NAVIGATE_HOME_REQUEST]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'home',
    null
  ],
  [SET_GEOSEARCH_VIEW]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'georesultaten-kaart-vergroten',
    null
  ],
  [SET_DETAIL_VIEW]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'detail-kaart-vergroten',
    null
  ],
  [SET_DATA_SELECTION_VIEW]: (tracking, state) => {
    const view = (tracking === DATA_SELECTION_VIEWS.LIST) ? 'kaart-weergeven'
      : (tracking === DATA_SELECTION_VIEWS.TABLE) ? 'tabel-weergeven'
        : (tracking === DATA_SELECTION_VIEWS.MAP) ? 'kaart-vergroten'
          : (tracking === DATA_SELECTION_VIEWS.LIST && getView(state) === DATA_SELECTION_VIEWS.MAP) ? 'kaart-verkleinen'
            : null;

    return view && ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation',
      `dataselectie-${view}`,
      null
    ]);
  },
  [SET_PANORAMA_VIEW]: (tracking, state) => {
    const view = (tracking === PANORAMA_VIEWS.MAP) ? 'kaart-vergroten'
      : (tracking === PANORAMA_VIEWS.PANO) ? 'beeld-weergeven'
        : (tracking === PANORAMA_VIEWS.MAP_PANO && getView(state) === PANORAMA_VIEWS.MAP) ? 'kaart-verkleinen'
          : (tracking === PANORAMA_VIEWS.MAP_PANO && getView(state) === PANORAMA_VIEWS.PANO) ? 'beeld-verkleinen'
            : null;

    return view && ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation',
      `panorama-${view}`,
      null
    ]);
  },
  // DATASET
  [routing.datasetsDetail.type]: ({ event, query }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    event,
    'Datasets',
    query
  ],
  [DOWNLOAD_DATASET_RESOURCE]: ({ dataset, resourceUrl }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download',
    dataset,
    resourceUrl
  ],
  // DATA SELECTION
  [DOWNLOAD_DATA_SELECTION]: (tracking) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download-tabel',
    `dataselectie-download-${tracking.toLowerCase()}`,
    null
  ],
  [SET_GEOMETRY_FILTER]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'filter',
    'dataselectie-polygoon-filter',
    'Locatie ingetekend'
  ],
  // MAP
  [routing.home.type]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'embed',
    'embedkaart',
    window.location.href
  ],
  [SET_MAP_BASE_LAYER]: (tracking) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'achtergrond',
    (tracking.startsWith('lf') ? 'luchtfoto' : 'topografie'),
    tracking
  ],
  [SET_MAP_CLICK_LOCATION]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'kaart',
    'kaart-puntzoek',
    null
  ],
  TOGGLE_MAP_OVERLAY: ({ category, title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'kaartlaag',
    category.toLowerCase().replace(/[: ][ ]*/g, '_'),
    title
  ],
  // SEARCH
  SHOW_SEARCH_RESULTS: ({ query, numberOfResults }) => [
    'trackSiteSearch',
    query,
    'data',
    numberOfResults
  ],
  // AUTHENTICATION
  [AUTHENTICATE_USER_REQUEST]: (tracking) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    tracking,
    null
  ],
  [AUTHENTICATE_USER_SUCCESS]: (tracking) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    'ingelogd',
    tracking
  ],
  // FILTERS
  [ADD_FILTER]: (tracking, state) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
        : null;

    return page && ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-tabel-filter`,
      Object.keys(tracking)[0]
    ]);
  },
  [REMOVE_FILTER]: (tracking, state) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
        : null;

    return page && ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-tabel-filter-verwijder`,
      tracking
    ]);
  },
  // PANORAMA
  [FETCH_PANORAMA_REQUEST_TOGGLE]: ({ year, missionType }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    (year > 0) ? `panorama-set-${year}${missionType}` : 'panorama-set-recent',
    null
  ],
  [FETCH_PANORAMA_HOTSPOT_REQUEST]: () => ([
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-navigation',
    'panorama-hotspot-klik',
    null
  ]),
  [SET_PANORAMA_LOCATION]: () => ([
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-navigatie',
    'panorama-kaart-klik',
    null
  ]),
  // MENU
  [REPORT_PROBLEM_REQUEST]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-terugmelden',
    null
  ],
  [SHOW_EMBED_PREVIEW]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-embedversie',
    null
  ],
  [SHOW_PRINT]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-printversie',
    null
  ]
};

export default events;
