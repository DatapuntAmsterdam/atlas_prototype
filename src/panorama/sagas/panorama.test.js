import { testSaga } from 'redux-saga-test-plan'
import { takeLatest } from 'redux-saga/effects'
import { routing } from '../../app/routes'
import { closeMapPanel } from '../../map/ducks/map/actions'
import { MAP_CLEAR, TOGGLE_MAP_OVERLAY } from '../../map/ducks/map/constants'
import { getMapCenter } from '../../map/ducks/map/selectors'
import { getViewMode, ViewMode } from '../../shared/ducks/ui/ui'
import { ForbiddenError } from '../../shared/services/api/customError'
import { getLocationPayload } from '../../store/redux-first-router/selectors'
import { fetchPanoramaRequest } from '../ducks/actions'
import {
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_SUCCESS,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_TAGS,
} from '../ducks/constants'
import { getLabelObjectByTags, getPanoramaLocation, getPanoramaTags } from '../ducks/selectors'
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api'
import {
  fetchFetchPanoramaEffect,
  fetchPanoramaById,
  fetchPanoramaByLocation,
  fetchPanoramaByTags,
  handlePanoramaRequest,
  watchFetchPanorama,
} from './panorama'

jest.mock('../ducks/selectors')

describe('watchPanoramaRoute', () => {
  const payload = { id: 'payload' }

  it('should dispatch the correct action', () => {
    testSaga(fetchFetchPanoramaEffect, { payload })
      .next()
      .select(getViewMode)
      .next(ViewMode.Full)
      .put(closeMapPanel())
      .next()
      .put(fetchPanoramaRequest(payload))
      .next()
      .isDone()
  })
})

describe('watchFetchPanorama', () => {
  const action = { type: FETCH_PANORAMA_REQUEST }

  it(`should watch ${FETCH_PANORAMA_REQUEST} and call fetchPanoramaById`, () => {
    testSaga(watchFetchPanorama)
      .next()
      .all([
        takeLatest([FETCH_PANORAMA_HOTSPOT_REQUEST, FETCH_PANORAMA_REQUEST], fetchPanoramaById),
        takeLatest([SET_PANORAMA_LOCATION], fetchPanoramaByLocation),
        takeLatest([SET_PANORAMA_TAGS], fetchPanoramaByTags),
      ])
      .next(action)
      .isDone()
  })
})

describe('fetchPanorma and fetchPanoramaByLocation', () => {
  describe('fetchPanoramaById', () => {
    it('should call handlePanoramaRequest with getImageDataById and id as an argument', () => {
      testSaga(fetchPanoramaById, { payload: { id: 'id123' } })
        .next()
        .select(getPanoramaTags)
        .next(['string'])
        .call(handlePanoramaRequest, getImageDataById, 'id123', ['string'])
        .next()
        .isDone()
    })
  })

  describe('fetchPanoramaByLocation', () => {
    it('should call handlePanoramaRequest with getImageDataByLocation and location as an argument', () => {
      testSaga(fetchPanoramaByLocation, { payload: [123, 321] })
        .next()
        .select(getPanoramaTags)
        .next(['string'])
        .call(handlePanoramaRequest, getImageDataByLocation, [123, 321], ['string'])
        .next()
        .isDone()
    })
  })

  describe('handlePanoramaRequest', () => {
    const mockPanoramaConfig = {
      layer: {
        id: 'foo',
        legendItems: [{ id: 'foo-legend' }],
      },
    }

    beforeEach(() => {
      getLabelObjectByTags.mockImplementationOnce(() => mockPanoramaConfig)
    })

    it('should dispatch a given function and dispatch FETCH_PANORAMA_SUCCESS, but not forward to new url', () => {
      const mockFn = jest.fn()

      testSaga(handlePanoramaRequest, mockFn, 'id123', ['string'])
        .next()
        .call(mockFn, 'id123', ['string'])
        .next({ id: 'newId' })
        .select(getLocationPayload)
        .next({ id: 'newId' })
        .put({
          type: MAP_CLEAR,
        })
        .next({ id: 'newId' })
        .put({
          type: TOGGLE_MAP_OVERLAY,
          payload: {
            mapLayers: ['foo-legend'],
          },
          meta: {
            tracking: mockPanoramaConfig.layer,
          },
        })
        .next()
        .put({
          type: FETCH_PANORAMA_SUCCESS,
          payload: { id: 'newId', tags: ['string'] },
          meta: {
            tracking: { id: 'newId', tags: ['string'] },
          },
        })
        .next()
        .isDone()
    })

    it('should dispatch a given function and dispatch FETCH_PANORAMA_SUCCESS, and forward to new url', () => {
      const mockFn = jest.fn()
      const additionalParams = {
        additionalParams: {
          tags: ['string'].join(),
          center: [123, 321],
          locatie: [123, 321],
        },
      }
      testSaga(handlePanoramaRequest, mockFn, 'id123', ['string'])
        .next()
        .call(mockFn, 'id123', ['string'])
        .next({ id: 'newId' })
        .select(getLocationPayload)
        .next({ id: 'oldId' })
        .put({
          type: MAP_CLEAR,
        })
        .next({ id: 'oldId' })
        .put({
          type: TOGGLE_MAP_OVERLAY,
          payload: {
            mapLayers: ['foo-legend'],
          },
          meta: {
            tracking: mockPanoramaConfig.layer,
          },
        })
        .next()
        .select(getMapCenter)
        .next([123, 321])
        .select(getPanoramaLocation)
        .next([123, 321])
        .put({
          type: routing.panorama.type,
          payload: { id: 'newId' },
          meta: {
            preserve: true,
            additionalParams,
            query: additionalParams,
          },
        })
        .next()
        .put({
          type: FETCH_PANORAMA_SUCCESS,
          payload: { id: 'newId', tags: ['string'] },
          meta: {
            tracking: { id: 'newId', tags: ['string'] },
          },
        })
        .next()
        .isDone()
    })

    it('should dispatch a given function and dispatch FETCH_PANORAMA_ERROR', () => {
      const mockFn = jest.fn()
      testSaga(handlePanoramaRequest, mockFn, 'id123', ['string'])
        .next()
        .call(mockFn, 'id123', ['string'])
        .throw('error')
        .put({
          type: FETCH_PANORAMA_ERROR,
          payload: 'error',
        })
        .next()
        .isDone()
    })

    it('should skip dispatching FETCH_PANORAMA_ERROR when error is 403', () => {
      const mockFn = jest.fn()
      testSaga(handlePanoramaRequest, mockFn, 'id123', ['string'])
        .next()
        .call(mockFn, 'id123', ['string'])
        .throw(new ForbiddenError(403, ''))
        .next()
        .isDone()
    })
  })
})
