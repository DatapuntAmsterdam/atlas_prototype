import { testSaga } from 'redux-saga-test-plan'
import watchMapDetail, { fetchDetailEffect, fetchMapDetail } from './map-detail'
import {
  fetchMapDetailFailure,
  fetchMapDetailSuccess,
  getMapDetail,
} from '../../ducks/detail/actions'
import { closeMapPanel, mapLoadingAction } from '../../ducks/map/actions'
import { FETCH_MAP_DETAIL_REQUEST } from '../../ducks/detail/constants'
import { VIEW_MODE, setViewMode } from '../../../shared/ducks/ui/ui'
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'
import {
  clearMapDetail,
  fetchDetailFailure,
  fetchDetailRequest,
  fetchDetailSuccess,
  showDetail,
} from '../../../shared/ducks/detail/actions'
import { toNotFoundPage } from '../../../store/redux-first-router/actions'

describe('watchFetchMapDetail', () => {
  const action = { type: FETCH_MAP_DETAIL_REQUEST }

  it('should watch FETCH_MAP_DETAIL_REQUEST and call fetchMapDetail', () => {
    testSaga(watchMapDetail)
      .next()
      .takeLatestEffect(FETCH_MAP_DETAIL_REQUEST, fetchMapDetail)
      .next(action)
      .next()
      .isDone()
  })
})

describe('fetchDetailEffect', () => {
  it('should close the map panel if navigating to the split view', () => {
    const action = {
      meta: {
        location: {
          prev: { query: { modus: VIEW_MODE.MAP } },
          current: { query: { modus: VIEW_MODE.SPLIT } },
        },
      },
    }
    testSaga(fetchDetailEffect, action)
      .next()
      .put(closeMapPanel())
      .next()
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .isDone()
  })

  it('should close the map panel if not switching to SPLIT view', () => {
    const action = {
      meta: {
        location: {
          prev: { query: { modus: VIEW_MODE.SPLIT } },
          current: { query: { modus: VIEW_MODE.SPLIT } },
        },
      },
    }
    testSaga(fetchDetailEffect, action)
      .next()
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .isDone()
  })
})

describe('fetchMapDetail', () => {
  const action = {
    endpoint: 'bag/ligplaats/',
    user: 'user',
  }

  it('should call fetchMapDetail and dispatch the correct action', () => {
    const mapDetailMock = {
      _display: 'display',
      geometrie: {},
    }
    testSaga(fetchMapDetail)
      .next()
      .put(fetchDetailRequest())
      .next()
      .next() // waitForAuthentication
      .next() // select
      .next(action.endpoint) // select
      .put(clearMapDetail())
      .next()
      .next(mapDetailMock) // fetchDetail
      .put(fetchMapDetailSuccess(action.endpoint, mapDetailMock))
      .next()
      .put(showDetail({ display: 'display', geometry: {} }))
      .next()
      .put(mapLoadingAction(false))
      .next()
      .next(action.endpoint)
      .put(fetchDetailSuccess(action.endpoint))
      .next()
      .isDone()
  })

  it('should set the viewmode to full when no geometry is available and user is not authorized', () => {
    const mapDetailMock = {
      _display: 'display',
      geometrie: null,
      isAuthorized: true,
    }
    testSaga(fetchMapDetail)
      .next()
      .put(fetchDetailRequest())
      .next()
      .next() // waitForAuthentication
      .next() // select
      .next(action.endpoint) // select
      .put(clearMapDetail())
      .next()
      .next(mapDetailMock) // fetchDetail
      .put(fetchMapDetailSuccess(action.endpoint, mapDetailMock))
      .next()
      .put(showDetail({ display: 'display', geometry: null }))
      .next()
      .put(setViewMode(VIEW_MODE.FULL)) // set the viewmode to full
      .next()
      .put(mapLoadingAction(false))
      .next()
      .next(action.endpoint)
      .put(fetchDetailSuccess(action.endpoint))
      .next()
      .isDone()
  })

  it('should throw dispatch geosearch when api error occurs', () => {
    const error = new Error('My Error')
    testSaga(fetchMapDetail, action)
      .next()
      .put(fetchDetailRequest())
      .next()
      .throw(error)
      .put(mapLoadingAction(false))
      .next()
      .put(fetchDetailFailure(error))
      .next()
      .put(fetchMapDetailFailure(error))
      .next()
      .isDone()
  })

  it('should throw error and go to not found page when api not found', () => {
    const error = new Error('My Error')
    error.status = 404
    testSaga(fetchMapDetail, action)
      .next()
      .put(fetchDetailRequest())
      .next()
      .throw(error)
      .put(mapLoadingAction(false))
      .next()
      .put(toNotFoundPage())
      .next()
      .put(fetchMapDetailFailure(error))
      .next()
      .isDone()
  })
})
