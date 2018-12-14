import get from 'lodash.get';
import { routing } from '../../../app/routes';

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
  switch (action.type) {
    case FETCH_SUGGESTIONS_REQUEST:
      return {
        ...state,
        count: 0,
        displayQuery: action.query,
        error: '',
        isLoading: true,
        typedQuery: action.query
      };
    case FETCH_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        count: action.suggestions.count,
        isLoading: false,
        suggestions: action.suggestions.data
      };
    case FETCH_SUGGESTIONS_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
        suggestions: []
      };
    case SET_ACTIVE_SUGGESTION:
      return {
        ...state,
        activeSuggestion: action.suggestion,
        displayQuery: action.suggestion.label,
        typedQuery: action.suggestion === -1 ? '' : state.typedQuery
      };
    case routing.dataSearch.type:
    case routing.searchDatasets.type:
      return {
        ...state,
        typedQuery: get(action, 'meta.query.zoekterm')
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

