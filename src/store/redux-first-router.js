import get from 'lodash.get';
import queryString from 'querystring';
import { createSelector } from 'reselect';
import PAGES from '../app/pages';
import { routing, ROUTER_NAMESPACE } from '../app/routes';
import { DATASETS } from '../shared/ducks/data-selection/constants';
import PARAMETERS from './parameters';
import paramsRegistry from './params-registry';

export const REDUCER_KEY = 'location';

// TODO: refactor unit test or remove all together
// Action creators
const actionWithQueries = (action, additionalParams, extraQueries = {}) => ({
  ...action,
  meta: {
    ...(action.meta) ? action.meta : {},
    query: {
      ...extraQueries,
      ...paramsRegistry.getNextQueries(additionalParams, action.type)
    }
  }
});

export const preserveQuery = (action, additionalParams = {}) => {
  const search = location.search && location.search.substr(1);
  return actionWithQueries(action, additionalParams, {
    ...queryString.decode(search), // Todo: temporary solution to pass existing query
    ...get(action, 'meta.query')
  });
};

// Determines if the route change should reinitialize the state for a reducer
export const shouldResetState = (action, allowedRoutes = []) => (action.type &&
  action.type.startsWith(ROUTER_NAMESPACE) &&
  allowedRoutes.every((route) => !action.type.includes(route))
);

export const toDataDetail = (id, type, subtype) => ({
  type: routing.dataDetail.type,
  payload: {
    type,
    subtype,
    id: `id${id}`
  }
});

const toDataSearch = () => ({
  type: routing.dataSearch.type
});

export const toDataSearchLocation = (location) => actionWithQueries(
  toDataSearch(), {
    [PARAMETERS.LOCATION]: location
  }
);

export const toDataSearchQuery = (searchQuery, filters, skipFetch = false) => actionWithQueries({
  type: routing.dataSearch.type,
  meta: {
    skipFetch
  }
}, {
  [PARAMETERS.QUERY]: searchQuery,
  [PARAMETERS.FILTERS]: filters
});

export const toMap = () => ({ type: routing.map.type });
export const toPanorama = (id) => ({
  type: routing.panorama.type,
  payload: {
    id
  }
});

export const toPanoramaAndPreserveQuery = (id, heading, reference = []) => preserveQuery(
  toPanorama(id), {
    heading,
    ...(reference.length === 3 ? { [PARAMETERS.REFERENCE]: reference } : {})
  }
);

export const extractIdEndpoint = (endpoint) => {
  const matches = endpoint.match(/\/([\w-]+)\/?$/);
  return matches[1];
};

const getDetailPageData = (endpoint) => {
  const matches = endpoint.match(/(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/); // eslint-disable-line no-useless-escape
  return {
    type: matches[1],
    subtype: matches[2],
    id: matches[3]
  };
};

export const getPageActionEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint);
  return preserveQuery(toDataDetail(id, type, subtype), {
    [PARAMETERS.VIEW]: view
  });
};

export const pageTypeToEndpoint = (type, subtype, id) => {
  let endpoint = 'https://acc.api.data.amsterdam.nl/';
  endpoint += `${type}/${subtype}/${id}/`; // TODO: refactor, get back-end to return detail as detail GET not listing!
  return endpoint;
};

export const toDataSearchCategory = (searchQuery, category) => actionWithQueries(
  {
    type: routing.dataSearchCategory.type,
    payload: {
      category
    }
  }, {
    [PARAMETERS.QUERY]: searchQuery
  }
);
export const toDatasets = () => ({ type: routing.datasets.type });
export const toDatasetSearch = (searchQuery, skipFetch = false) => preserveQuery({
  type: routing.searchDatasets.type,
  meta: {
    skipFetch
  }
}, {
  [PARAMETERS.QUERY]: searchQuery
});

export const toDatasetsWithFilter = () => ({
  type: routing.datasets.type
});

export const toDataSuggestion = (payload) => {
  const { type, subtype, id } = getDetailPageData(payload.endpoint);
  const action = {
    type: routing.dataDetail.type,
    payload: {
      type,
      subtype,
      id: `id${id}`
    },
    meta: {
      tracking: {
        category: payload.category,
        event: 'auto-suggest',
        query: payload.typedQuery
      }
    }
  };
  return action;
};

export const toDatasetSuggestion = (payload) => ({
  type: routing.datasetsDetail.type,
  payload,
  meta: {
    tracking: {
      event: 'auto-suggest',
      query: payload.typedQuery
    }
  }
});

const DATASET_ROUTE_MAPPER = {
  [DATASETS.HR]: routing.establishments.type,
  [DATASETS.BAG]: routing.addresses.type,
  [DATASETS.BRK]: routing.cadastralObjects.type
};

export const toDatasetPage = (dataset) => ({
  type: DATASET_ROUTE_MAPPER[dataset]
});

export const toDatasetsTableWithFilter = (datasetType, filter) => actionWithQueries({
  type: datasetType
}, {
  [PARAMETERS.FILTERS]: btoa(JSON.stringify(filter))
});


// Selectors
const getLocation = (state) => state[REDUCER_KEY];

export const getLocationType = (state) => state[REDUCER_KEY].type;
export const getLocationQuery = createSelector(getLocation, (location) => location.query || {});
export const getLocationPayload = createSelector(getLocation, (location) => location.payload);
export const getDetailLocation = createSelector(
  getLocation,
  ({ payload: { type, subtype, id } }) => (
    (type && subtype && id) ? [id.slice(2), type, subtype] : [])
);

export const getPage = createSelector(getLocation, (location = {}) => {
  const key = Object.keys(routing).find((route) => routing[route].type === location.type);
  return (key && routing[key].page) || routing.niet_gevonden.page;
});

export const isMapView = createSelector(
  getLocationQuery,
  (query) => (
    Object.prototype.hasOwnProperty.call(query, 'kaart') || false
  )
);

export const isLocationSelected = createSelector(
  getLocationQuery,
  (query) => (
    Object.prototype.hasOwnProperty.call(query, PARAMETERS.LOCATION) || false
  )
);

export const isHomepage = createSelector(getPage, (page) => page === PAGES.HOME);

export const isMapPage = createSelector(getPage, (page) => page === PAGES.MAP);

export const isPanoPage = createSelector(getPage, (page) => page === PAGES.PANORAMA);

export const isDataDetailPage = createSelector(getPage, (page) => page === PAGES.DATA_DETAIL);

export const isMapActive = createSelector(
  isMapView, isMapPage,
  (isMap, isMapPageActive) => isMap || isMapPageActive
);

export const isDatasetPage = createSelector(
  getPage,
  (page) => page === PAGES.DATASETS
    || page === PAGES.DATASETS_DETAIL
    || page === PAGES.SEARCH_DATASETS
);

export const isDataSelectionPage = createSelector(
  getPage,
  (page) => page === PAGES.ADDRESSES
    || page === PAGES.CADASTRAL_OBJECTS
    || page === PAGES.ESTABLISHMENTS
);

export const isDataSearch = createSelector(
  getPage,
  isMapActive,
  isLocationSelected,
  (page, mapActive, locationSelected) =>
    (page === PAGES.DATA_SEARCH || (mapActive && locationSelected))
);
