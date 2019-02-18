import { createSelector } from 'reselect';
import queryString from 'querystring';
import PAGES from '../../app/pages';
import { routing } from '../../app/routes';
import { REDUCER_KEY } from './constants';
import { getUser } from '../../shared/ducks/user/user';

const getLocation = (state) => state[REDUCER_KEY];
export const getLocationType = (state) => state[REDUCER_KEY].type;

// Since redux-first-router doesn't update the query parameters, we have to use window.location
// Please update redux-first-router so we can use the state again
export const getLocationQuery = () => {
  const search = location.search && location.search.substr(1);
  return search ? queryString.decode(search) : {};
};

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
export const isHomepage = createSelector(getPage, (page) => page === PAGES.HOME);
export const isDataPage = createSelector(getPage, (page) => page === PAGES.DATA);
export const isPanoPage = createSelector(getPage, (page) => page === PAGES.PANORAMA);
export const isDataDetailPage = createSelector(getPage, (page) => page === PAGES.DATA_DETAIL);
export const isDatasetDetailPage = createSelector(
  getPage, (page) => page === PAGES.DATASET_DETAIL
);

export const isDatasetPage = createSelector(
  getPage,
  (page) => page === PAGES.DATASETS
    || page === PAGES.DATASET_DETAIL
    || page === PAGES.SEARCH_DATASETS
);

export const isDataSelectionPage = createSelector(
  getPage,
  (page) => page === PAGES.ADDRESSES
    || page === PAGES.CADASTRAL_OBJECTS
    || page === PAGES.ESTABLISHMENTS
);

export const hasUserAccesToPage = createSelector(
  getPage, getUser,
  (page, user) => (page === PAGES.ADDRESSES
    || (page === PAGES.ESTABLISHMENTS && user.authenticated)
    || (page === PAGES.CADASTRAL_OBJECTS && user.scopes.includes('BRK/RSN'))
  )
);

