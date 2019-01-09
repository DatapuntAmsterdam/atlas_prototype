import get from 'lodash.get';
import { routing } from '../../../app/routes';
import paramsRegistry from '../../../store/params-registry';
import PARAMETERS from '../../../store/parameters';
import PAGES from '../../../app/pages';
import { shouldResetState } from '../../../store/redux-first-router';

const REDUCER_KEY = 'autoSuggest';
export { REDUCER_KEY as AUTO_SUGGEST };
export const SET_ACTIVE_SUGGESTION = 'SET_ACTIVE_SUGGESTION';
export const FETCH_SUGGESTIONS_REQUEST = 'FETCH_SUGGESTIONS_REQUEST';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';

const initialState = {
  count: 0,
  displayQuery: '',
  error: '',
  isLoading: false,
  suggestions: [],
  typedQuery: ''
};

export default function AutoSuggestReducer(state = initialState, action) {
  // cleanup the state for this reducer when not on the search routes
  if (shouldResetState(action, [PAGES.DATA_SEARCH, PAGES.SEARCH_DATASETS])) {
    return initialState;
  }

  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };
  switch (action.type) {
    case FETCH_SUGGESTIONS_REQUEST:
      return {
        ...enrichedState,
        count: 0,
        displayQuery: action.query,
        error: '',
        isLoading: true,
        typedQuery: action.query
      };
    case FETCH_SUGGESTIONS_SUCCESS:
      return {
        ...enrichedState,
        count: action.suggestions.count,
        isLoading: false,
        suggestions: action.suggestions.data
      };
    case FETCH_SUGGESTIONS_FAILURE:
      return {
        ...enrichedState,
        error: action.error,
        isLoading: false,
        suggestions: []
      };
    case SET_ACTIVE_SUGGESTION:
      return {
        ...enrichedState,
        activeSuggestion: action.suggestion,
        displayQuery: action.suggestion.label,
        typedQuery: enrichedState.typedQuery
      };

    // Todo: DP-6480 Refactor this: conflict with other queryParam in data-search reducer
    case routing.dataSearch.type:
    case routing.searchDatasets.type:
      return {
        ...enrichedState,
        typedQuery: get(action, `meta.query[${PARAMETERS.QUERY}]`)
      };

    default:
      return state;
  }
}

// Selectors
export const getActiveSuggestions = (state) => state.autoSuggest.activeSuggestion;
export const getDisplayQuery = (state) => state.autoSuggest.displayQuery;
export const getNumberOfSuggestions = (state) => state.autoSuggest.count;
export const getAutoSuggestSuggestions = (state) => state.autoSuggest.suggestions;
export const getTypedQuery = (state) => state.autoSuggest.typedQuery;

// Action creators
export const setActiveSuggestionAction = (suggestion = { index: -1 }) =>
  ({ type: SET_ACTIVE_SUGGESTION, suggestion });

export const getSuggestionsAction = (query = '') =>
  ({ type: FETCH_SUGGESTIONS_REQUEST, query });

