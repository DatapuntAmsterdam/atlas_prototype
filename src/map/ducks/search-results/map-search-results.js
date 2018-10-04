import { createSelector } from 'reselect';

export const FETCH_MAP_SEARCH_RESULTS_REQUEST = 'FETCH_MAP_SEARCH_RESULTS_REQUEST';
export const FETCH_MAP_SEARCH_RESULTS_SUCCESS = 'FETCH_MAP_SEARCH_RESULTS_SUCCESS';
export const FETCH_MAP_SEARCH_RESULTS_FAILURE = 'FETCH_MAP_SEARCH_RESULTS_FAILURE';

export const getSearch = (state) => state.search;
export const getMapResultsByLocation = (state) => state.mapSearchResultsByLocation;

export const isSearchActive = createSelector(getSearch, (geoSearch) => (
  geoSearch && geoSearch.location && geoSearch.location.length
));

const initialState = {
  mapSearchResultsByLocation: {},
  isLoading: false
};

export default function MapSearchResultsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAP_SEARCH_RESULTS_REQUEST:
      return {
        ...state,
        search: {
          ...state.search,
          isLoading: true
        }
      };

    case FETCH_MAP_SEARCH_RESULTS_SUCCESS: {
      const locationId = Object.values(action.location).toString();
      return {
        ...state,
        isLoading: false,
        mapSearchResultsByLocation: {
          ...state.mapSearchResultsByLocation,
          [locationId]: action.mapSearchResults
        },
        search: {
          ...state.search,
          isLoading: false
        }
      };
    }

    case FETCH_MAP_SEARCH_RESULTS_FAILURE:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}

export const getMapSearchResults = (location, user) => ({
  type: FETCH_MAP_SEARCH_RESULTS_REQUEST,
  location,
  user
});
