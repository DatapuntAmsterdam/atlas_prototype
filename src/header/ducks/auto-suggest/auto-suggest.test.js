import { routing } from '../../../app/routes'
import reducer, { getSuggestionsAction, setActiveSuggestionAction } from './auto-suggest'
import {
  FETCH_SUGGESTIONS_FAILURE,
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  SET_ACTIVE_SUGGESTION,
} from './constants'

const initialState = {
  count: 0,
  displayQuery: '',
  error: '',
  isLoading: false,
  suggestions: [],
  typedQuery: '',
}

describe('AutoSuggestReducer Reducer', () => {
  it('should load the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it(`should set the user data when ${FETCH_SUGGESTIONS_REQUEST} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: FETCH_SUGGESTIONS_REQUEST,
        payload: { query: 'query' },
      }),
    ).toEqual({
      count: 0,
      displayQuery: 'query',
      error: '',
      isLoading: true,
      suggestions: [],
      typedQuery: 'query',
    })
  })

  it(`should set the user data when ${FETCH_SUGGESTIONS_SUCCESS} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: FETCH_SUGGESTIONS_SUCCESS,
        suggestions: {
          count: 1,
          data: { some: 'data' },
        },
      }),
    ).toEqual({
      count: 1,
      displayQuery: '',
      error: '',
      isLoading: false,
      suggestions: {
        some: 'data',
      },
      typedQuery: '',
    })
  })

  it(`should set the user data when ${SET_ACTIVE_SUGGESTION} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: SET_ACTIVE_SUGGESTION,
        suggestion: {
          label: 'label',
        },
      }),
    ).toEqual({
      activeSuggestion: { label: 'label' },
      count: 0,
      displayQuery: 'label',
      error: '',
      isLoading: false,
      suggestions: [],
      typedQuery: '',
    })
  })

  it(`should set error details when ${FETCH_SUGGESTIONS_FAILURE} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: FETCH_SUGGESTIONS_FAILURE,
        error: 'error',
      }),
    ).toEqual({
      ...initialState,
      error: 'error',
    })
  })

  it('should set the query from meta data', () => {
    const tabRoutes = [
      routing.dataSearch.type,
      routing.datasetSearch.type,
      routing.articleSearch.type,
      routing.publicationSearch.type,
      routing.collectionSearch.type,
      routing.mapSearch.type,
    ]

    tabRoutes.forEach((route) => {
      expect(
        reducer(initialState, {
          type: route,
          meta: {
            query: { term: 'foo' },
          },
        }),
      ).toEqual({
        ...initialState,
        typedQuery: 'foo',
      })
    })
  })
})

describe('The set active suggestion action', () => {
  it('should set the active hence highlighted suggestion', () => {
    expect(setActiveSuggestionAction('123', 'name', ['scope'])).toEqual({
      type: SET_ACTIVE_SUGGESTION,
      suggestion: '123',
    })
  })

  it('should set the index to -1 if no suggestion is given', () => {
    expect(setActiveSuggestionAction()).toEqual({
      type: SET_ACTIVE_SUGGESTION,
      suggestion: { index: -1 },
    })
  })
})

it('should return the right action', () => {
  expect(getSuggestionsAction()).toEqual({
    payload: { query: '', type: '' },
    type: FETCH_SUGGESTIONS_REQUEST,
  })
})
