import get from 'lodash.get'
import PAGES from '../../../app/pages'
import { routing } from '../../../app/routes'
import PARAMETERS from '../../../store/parameters'
import paramsRegistry from '../../../store/params-registry'
import { shouldResetState } from '../../../store/redux-first-router/actions'
import {
  FETCH_SUGGESTIONS_FAILURE,
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  initialState,
  REDUCER_KEY,
  SET_ACTIVE_SUGGESTION,
} from './constants'

export default function AutoSuggestReducer(state = initialState, action) {
  // cleanup the state for this reducer when not on the search routes
  if (
    shouldResetState(action, [
      PAGES.SEARCH,
      PAGES.DATA_SEARCH,
      PAGES.DATASET_SEARCH,
      PAGES.ARTICLE_SEARCH,
      PAGES.PUBLICATION_SEARCH,
      PAGES.SPECIAL_SEARCH,
      PAGES.COLLECTION_SEARCH,
    ])
  ) {
    return initialState
  }

  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }
  switch (action.type) {
    case FETCH_SUGGESTIONS_REQUEST:
      return {
        ...enrichedState,
        count: 0,
        displayQuery: action.payload.query,
        error: '',
        isLoading: true,
        typedQuery: action.payload.query,
      }
    case FETCH_SUGGESTIONS_SUCCESS:
      return {
        ...enrichedState,
        count: action.suggestions.count,
        isLoading: false,
        suggestions: action.suggestions.data,
      }
    case FETCH_SUGGESTIONS_FAILURE:
      return {
        ...enrichedState,
        error: action.error,
        isLoading: false,
        suggestions: [],
      }
    case SET_ACTIVE_SUGGESTION:
      return {
        ...enrichedState,
        activeSuggestion: action.suggestion,
        displayQuery: action.suggestion.label,
        typedQuery: enrichedState.typedQuery,
      }

    // Sets the typedQuery based on the selected tab
    case routing.search.type:
    case routing.dataSearch.type:
    case routing.datasetSearch.type:
    case routing.articleSearch.type:
    case routing.publicationSearch.type:
    case routing.specialSearch.type:
    case routing.collectionSearch.type:
    case routing.mapSearch.type:
      return {
        ...enrichedState,
        typedQuery: get(action, `meta.query[${PARAMETERS.QUERY}]`),
      }

    default:
      return state
  }
}

// Action creators
export const setActiveSuggestionAction = (suggestion = { index: -1 }) => ({
  type: SET_ACTIVE_SUGGESTION,
  suggestion,
})

export const getSuggestionsAction = (query = '', type = '') => ({
  type: FETCH_SUGGESTIONS_REQUEST,
  payload: { query, type },
})

// Selectors
export const getActiveSuggestions = (state) => state.autoSuggest.activeSuggestion
export const getDisplayQuery = (state) => state.autoSuggest.displayQuery
export const getNumberOfSuggestions = (state) => state.autoSuggest.count
export const getAutoSuggestSuggestions = (state) => state.autoSuggest.suggestions
export const getTypedQuery = (state) => state.autoSuggest.typedQuery
