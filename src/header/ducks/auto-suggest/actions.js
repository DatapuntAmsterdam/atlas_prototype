import { SET_ACTIVE_SUGGESTION, FETCH_SUGGESTIONS_REQUEST, SELECT_SUGGESTION } from './constants';

// Action creators
export const setActiveSuggestionAction = (suggestion = { index: -1 }) =>
  ({ type: SET_ACTIVE_SUGGESTION, suggestion });

export const getSuggestionsAction = (query = '') =>
  ({ type: FETCH_SUGGESTIONS_REQUEST, query });

export const selectSuggestionAction = (suggestion, view) =>
  ({ type: SELECT_SUGGESTION, payload: { suggestion, view } });

