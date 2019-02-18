export const REDUCER_KEY = 'autoSuggest';

export const SET_ACTIVE_SUGGESTION = `${REDUCER_KEY}/SET_ACTIVE_SUGGESTION`;
export const FETCH_SUGGESTIONS_REQUEST = `${REDUCER_KEY}/FETCH_SUGGESTIONS_REQUEST`;
export const FETCH_SUGGESTIONS_SUCCESS = `${REDUCER_KEY}/FETCH_SUGGESTIONS_SUCCESS`;
export const FETCH_SUGGESTIONS_FAILURE = `${REDUCER_KEY}/FETCH_SUGGESTIONS_FAILURE`;

export const initialState = {
  count: 0,
  displayQuery: '',
  error: '',
  isLoading: false,
  suggestions: [],
  typedQuery: ''
};
