import get from 'lodash.get';
import queryString from 'querystring';
import createHistory from 'history/createBrowserHistory';
import { select, takeLatest } from 'redux-saga/effects';
import mapQuery, { ACTIONS as MAP_ACTIONS } from '../map/ducks/map/map-query';
import filtersQuery, { ACTIONS as FILTERS_ACTIONS } from '../shared/ducks/filters/filters-query';
import panoramaQuery, { ACTIONS as PANORAMA_ACTIONS } from '../shared/ducks/panorama/panorama-query';
import dataSelectionQuery, { ACTIONS as DATA_SELECTION_ACTIONS } from '../shared/ducks/data-selection/query';
import dataSearchQuery, { ACTIONS as DATA_SEARCH_ACTIONS } from '../shared/ducks/data-search/query';
import datasetQuery, { ACTIONS as DATASET_ACTIONS } from '../shared/ducks/datasets/datasets-query';
import detailQuery, { ACTIONS as DETAIL_ACTIONS } from '../shared/ducks/detail/query';
import uiQuery, { ACTIONS as UI_ACTIONS } from '../shared/ducks/ui/ui-query';
import { getLocationQuery } from './redux-first-router';
import { ROUTER_NAMESPACE } from '../app/routes';

const separateHistory = createHistory();

const watchedActions = [
  ...MAP_ACTIONS,
  ...PANORAMA_ACTIONS,
  ...FILTERS_ACTIONS,
  ...DATA_SELECTION_ACTIONS,
  ...DATASET_ACTIONS,
  ...UI_ACTIONS,
  ...DATA_SEARCH_ACTIONS,
  ...DETAIL_ACTIONS
];

const querieObjects = [
  mapQuery,
  filtersQuery,
  panoramaQuery,
  dataSelectionQuery,
  datasetQuery,
  uiQuery,
  dataSearchQuery,
  detailQuery
];

/**
 * This is introduced to check if the query key's are unique, otherwise throw a warning and don't
 * override the key in the object.
 */
const queryMappings = querieObjects.reduce((acc, queryObject) => ({
  ...acc,
  ...Object.keys(queryObject).reduce((cleanedQueryObject, key) => {
    if (key in acc) {
      // eslint-disable-next-line no-console
      console.warn(`Warning: query key "${key}" is already registered in another file`);
      return cleanedQueryObject;
    }
    return {
      ...cleanedQueryObject,
      [key]: queryObject[key]
    };
  }, {})
}), {});

function* updateQuery() {
  const state = yield select();
  const currentQuery = yield select(getLocationQuery);
  const query = { ...currentQuery };

  let addHistory = false;
  Object.entries(queryMappings).forEach(([param, mapping]) => {
    const { selector, defaultValue } = mapping;
    const selectedState = selector(state);

    if (typeof selectedState !== 'undefined' && selectedState !== defaultValue) {
      query[param] = selectedState;
      if (mapping.addHistory) {
        addHistory = true;
      }
    } else {
      if (query[param] && mapping.addHistory) {
        // Value was set, so removal action should be added to history
        addHistory = true;
      }
      delete query[param];
    }
  });

  const orderedQuery = Object.keys(query).sort().reduce((acc, key) => {
    acc[key] = query[key];
    return acc;
  }, {});

  const searchQuery = queryString.stringify(orderedQuery);
  const currentPath = window.location.pathname;
  // NOTE: changing history using different history wrapper than the one used in redux-first-router!
  // We need to work with a different history object to prevent redux-first-router from reacting to
  // query changes. If we were to use the same history object, a route change would fire for every
  // query change.
  // TODO: refactor, fix hack or start resolution trajectory for redux-first-router
  if (addHistory) {
    separateHistory.push(`${currentPath}?${searchQuery}`);
  } else {
    separateHistory.replace(`${currentPath}?${searchQuery}`);
  }
}

export const getStateFromQuery = (definitions, action) => (
  (action.type && action.type.startsWith(ROUTER_NAMESPACE)) ?
    Object.keys(definitions).reduce((acc, key) => {
      acc[definitions[key].stateKey] =
        definitions[key].decode(get(action, `meta.query[${key}]`, definitions[key].defaultValue));
      return acc;
    }, {}) :
    {}
);

export default function* watchQueryActions() {
  yield takeLatest(watchedActions, updateQuery);
}
