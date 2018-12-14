import { createSelector } from 'reselect';
import queryString from 'querystring';
import get from 'lodash.get';
import { routing } from '../app/routes';
import PAGES from '../app/pages';
import PANORAMA_VIEW from '../shared/ducks/panorama/panorama-view';

export const REDUCER_KEY = 'location';

// TODO: refactor unit test or remove all together
// Action creators
export const toHome = () => ({ type: routing.home.type });

export const preserveQuery = (action) => {
  const search = location.search && location.search.substr(1);
  return {
    ...action,
    meta: {
      query: {
        ...queryString.decode(search), // Todo: temporary solution to pass existing query
        ...get(action, 'meta.query')
      }
    }
  };
};
export const toDataDetail = (id, type, subtype, view) => (preserveQuery({
  type: routing.dataDetail.type,
  payload: {
    type,
    subtype,
    id: `id${id}`
  },
  meta: {
    query: {
      ...view ? { detailModus: view } : {}
    }
  }
}));
export const toDataSearchLocationAndPreserveQuery = () => preserveQuery({ // TODO rename
  type: routing.dataSearch.type
});
export const toDataSearchLocation = (payload) => ({ // TODO rename
  type: routing.dataSearch.type,
  meta: {
    query: {
      locatie: payload
    }
  }
});
export const toMapAndPreserveQuery = () => preserveQuery({ type: routing.map.type });
export const toMap = () => ({ type: routing.map.type });
export const toPanorama = (id, heading, view) => {
  const action = {
    type: routing.panorama.type,
    payload: {
      id
    },
    meta: {
      query: {
        heading
      }
    }
  };
  if (view === PANORAMA_VIEW.PANO) {
    action.meta.query.panorama = '';
  }
  return action;
};
export const extractIdEndpoint = (endpoint) => {
  const matches = endpoint.match(/\/([\w-]+)\/?$/);
  return matches[1];
};
const getDetailPageData = (endpoint) => {
  const matches = endpoint.match(/(\w+)\/([\w]+)\/([\w\.-]+)\/?$/); // eslint-disable-line no-useless-escape
  return {
    type: matches[1],
    subtype: matches[2],
    id: matches[3]
  };
};
export const getPageActionEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint);
  return toDataDetail(id, type, subtype, view);
};
export const pageTypeToEndpoint = (type, subtype, id) => {
  let endpoint = 'https://acc.api.data.amsterdam.nl/';
  endpoint += `${type}/${subtype}/${id}/`; // TODO: refactor, get back-end to return detail as detail GET not listing!
  return endpoint;
};
export const toDataSearch = (searchQuery, skipFetch = false) => ({
  type: routing.dataSearch.type,
  meta: {
    skipFetch,
    query: {
      zoekterm: searchQuery
    }
  }
});
export const toDataSearchCategory = (searchQuery, category) => ({
  type: routing.dataSearchCategory.type,
  payload: {
    category
  },
  meta: {
    query: {
      zoekterm: searchQuery
    }
  }
});
export const toDatasets = () => ({ type: routing.datasets.type });
export const toDatasetSearch = (searchQuery, skipFetch = false) => ({
  type: routing.searchDatasets.type,
  meta: {
    skipFetch,
    query: {
      zoekterm: searchQuery
    }
  }
});

export const toDatasetsWithFilter = (themeSlug) => ({
  type: routing.datasets.type,
  meta: {
    query: {
      filters: btoa(JSON.stringify({ groups: themeSlug }))
    }
  }
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
export const toControlPage = () => ({
  type: routing.bediening.type
});

// Selectors
const getLocation = (state) => state[REDUCER_KEY];

export const getLocationQuery = createSelector(getLocation, (location) => location.query || {});
export const getLocationPayload = createSelector(getLocation, (location) => location.payload);

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
    Object.prototype.hasOwnProperty.call(query, 'locatie') || false
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
