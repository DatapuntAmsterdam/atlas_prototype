import { testSaga, expectSaga } from 'redux-saga-test-plan';

import watchFetchMapBaseLayers, { fetchMapBaseLayers } from './map-base-layers';

import { getMapBaseLayers } from '../../services';
import {
  FETCH_MAP_BASE_LAYERS_REQUEST,
  FETCH_MAP_BASE_LAYERS_SUCCESS,
  FETCH_MAP_BASE_LAYERS_FAILURE
} from '../../ducks/base-layers/map-base-layers';

describe('watchFetchMapBaseLayers', () => {
  const action = { type: FETCH_MAP_BASE_LAYERS_REQUEST };

  it('should watch FETCH_MAP_BASE_LAYERS_REQUEST and call fetchMapBaseLayers', () => {
    testSaga(watchFetchMapBaseLayers)
      .next()
      .takeLatestEffect(FETCH_MAP_BASE_LAYERS_REQUEST, fetchMapBaseLayers)
      .next(action)
      .isDone();
  });
});

describe('fetchMapBaseLayers', () => {
  it('should call getMapBaseLayers and dispatch the correct action', () => (
    expectSaga(fetchMapBaseLayers)
      .provide({
        call(effect, next) {
          return effect.fn === getMapBaseLayers ? 'mapBaseLayers' : next();
        }
      })
      .put({
        type: FETCH_MAP_BASE_LAYERS_SUCCESS,
        mapBaseLayers: 'mapBaseLayers'
      })
      .run()
  ));

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(fetchMapBaseLayers)
      .next()
      .throw(error)
      .put({ type: FETCH_MAP_BASE_LAYERS_FAILURE, error })
      .next()
      .isDone();
  });
});
