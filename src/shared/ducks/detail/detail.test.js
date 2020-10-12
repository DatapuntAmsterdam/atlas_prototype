import reducer from './reducer'
import { getDetail, getDetailGeometry, getDetailDisplay } from './selectors'
import {
  CLEAR_MAP_DETAIL,
  SHOW_DETAIL,
  FETCH_DETAIL_REQUEST,
  FETCH_DETAIL_SUCCESS,
  FETCH_DETAIL_FAILURE,
} from './constants'
import { clearMapDetail } from './actions'

describe('DetailReducer', () => {
  const initialState = {}

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
    })
  })

  it(`should set the location when ${CLEAR_MAP_DETAIL} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: CLEAR_MAP_DETAIL,
        payload: 'payload',
      }),
    ).toEqual({
      isLoading: true,
    })
  })

  it(`should set the detail data when ${SHOW_DETAIL} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: SHOW_DETAIL,
        payload: {
          display: 'display',
          geometry: 'geometry',
        },
      }),
    ).toEqual({
      display: 'display',
      geometry: 'geometry',
      isLoading: false,
    })
  })

  it('should clear any detail data when a route change is initialized', () => {
    expect(
      reducer(initialState, {
        type: FETCH_DETAIL_REQUEST,
      }),
    ).toEqual({
      includeSrc: null,
      data: {},
      filterSelection: {},
      isLoading: true,
    })
  })

  it(`should set the detail data when ${FETCH_DETAIL_SUCCESS} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: FETCH_DETAIL_SUCCESS,
        payload: { data: 'data' },
      }),
    ).toEqual({
      data: 'data',
      isLoading: false,
    })
  })

  it(`should not set the detail data when ${FETCH_DETAIL_FAILURE} is dispatched`, () => {
    expect(
      reducer(initialState, {
        type: FETCH_DETAIL_FAILURE,
      }),
    ).toEqual({
      includeSrc: null,
      data: {},
      filterSelection: {},
      isLoading: false,
    })
  })
})

describe('Detail Actions', () => {
  describe('clearMapDetail method', () => {
    it('should return an object with action type and payload containing an endpoint', () => {
      expect(clearMapDetail('endpoint')).toEqual({
        type: CLEAR_MAP_DETAIL,
        payload: 'endpoint',
      })
    })
  })
})

describe('Detail Selectors', () => {
  const initialState = reducer(undefined, {})

  it('should return detail information from the state', () => {
    expect(getDetail({ detail: initialState })).toEqual(initialState)
    expect(getDetailGeometry({ detail: initialState })).toEqual(initialState.geometry)
    expect(getDetailDisplay({ detail: initialState })).toEqual(initialState.display)
  })
})
