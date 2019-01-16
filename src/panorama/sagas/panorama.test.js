import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { takeLatest } from 'redux-saga/effects';
import {
  maybeChangeRoute,
  doClosePanorama,
  fetchPanoramaById,
  fetchPanoramaByLocation,
  fetchPanoramaRequest,
  fireFetchPanormaRequest,
  handlePanoramaRequest,
  watchClosePanorama,
  watchFetchPanorama,
  watchPanoramaRoute
} from './panorama';
import { routing } from '../../app/routes';
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api';
import { TOGGLE_MAP_OVERLAY_PANORAMA } from '../../map/ducks/map/map';
import { toMap } from '../../store/redux-first-router/actions';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  FETCH_PANORAMA_SUCCESS,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../../panorama/ducks/constants';
import { getPanoramaHistory, getPanoramaLocation } from '../ducks/selectors';

describe('watchPanoramaRoute', () => {
  const action = { type: routing.panorama.type };
  const payload = { id: 'payload' };
  const meta = { tracking: true };

  it(`should watch ${routing.panorama.type} and call fireFetchPanormaRequest`, () => {
    testSaga(watchPanoramaRoute)
      .next()
      .takeLatestEffect(routing.panorama.type, fireFetchPanormaRequest)
      .next(action)
      .isDone();
  });

  it('should dispatch the correct action', () => (
    expectSaga(fireFetchPanormaRequest, { payload })
      .provide({
        call(effect, next) {
          return effect.fn === fetchPanoramaRequest ? 'payload' : next();
        }
      })
      .put({
        type: FETCH_PANORAMA_REQUEST,
        payload,
        meta
      })
      .run()
  ));
});

describe('watchFetchPanorama', () => {
  const action = { type: FETCH_PANORAMA_REQUEST };

  it(`should watch ${FETCH_PANORAMA_REQUEST} and call fetchPanoramaById`, () => {
    testSaga(watchFetchPanorama)
      .next()
      .all([
        takeLatest([FETCH_PANORAMA_HOTSPOT_REQUEST, FETCH_PANORAMA_REQUEST], fetchPanoramaById),
        takeLatest([
          SET_PANORAMA_YEAR,
          SET_PANORAMA_LOCATION,
          FETCH_PANORAMA_REQUEST_TOGGLE
        ], fetchPanoramaByLocation)
      ])
      .next(action)
      .isDone();
  });
});

describe('watchClosePanorama', () => {
  const action = { type: CLOSE_PANORAMA };

  it(`should watch ${CLOSE_PANORAMA} and call closePanorama`, () => {
    testSaga(watchClosePanorama)
      .next()
      .takeLatestEffect(CLOSE_PANORAMA, doClosePanorama)
      .next(action)
      .isDone();
  });

  it('should call doClosePanorama and dispatch the correct action', () => {
    expectSaga(doClosePanorama)
      .provide({
        call(effect) {
          return effect.fn === toMap();
        }
      })
      .run();
  });
});

describe('fetchPanorma and fetchPanoramaByLocation', () => {
  describe('fetchPanoramaById', () => {
    it('should call handlePanoramaRequest with getImageDataById and id as an argument', () => {
      testSaga(fetchPanoramaById, { payload: { id: 'id123' } })
        .next()
        .call(handlePanoramaRequest, getImageDataById, 'id123')
        .next()
        .isDone();
    });
  });

  describe('fetchPanoramaByLocation', () => {
    it('should call handlePanoramaRequest with getImageDataByLocation and location as an argument', () => {
      testSaga(fetchPanoramaByLocation)
        .next()
        .select(getPanoramaLocation)
        .next([123, 321])
        .call(handlePanoramaRequest, getImageDataByLocation, undefined, [123, 321])
        .next()
        .isDone();
    });
  });


  describe('handlePanoramaRequest', () => {
    it('should dispatch a given function and dispatch FETCH_PANORAMA_SUCCESS', () => {
      const mockFn = jest.fn();
      testSaga(handlePanoramaRequest, mockFn, 'id123')
        .next()
        .select(getPanoramaHistory)
        .next({ year: 0 })
        .call(maybeChangeRoute, 'id123')
        .next()
        .call(mockFn, 'id123', { year: 0 })
        .next({ id: 'newId' })
        .call(maybeChangeRoute, 'newId')
        .next()
        .put({
          type: FETCH_PANORAMA_SUCCESS,
          payload: { id: 'newId' },
          meta: {
            tracking: { id: 'newId' }
          }
        })
        .next()
        .put({
          type: TOGGLE_MAP_OVERLAY_PANORAMA,
          payload: 'pano'
        })
        .next()
        .isDone();
    });

    it('should dispatch a given function and dispatch FETCH_PANORAMA_ERROR', () => {
      const mockFn = jest.fn();
      testSaga(handlePanoramaRequest, mockFn, 'id123')
        .next()
        .select(getPanoramaHistory)
        .next({ year: 0 })
        .call(maybeChangeRoute, 'id123')
        .next()
        .call(mockFn, 'id123', { year: 0 })
        .throw('error')
        .put({
          type: FETCH_PANORAMA_ERROR,
          payload: 'error'
        })
        .next()
        .isDone();
    });
  });
});
