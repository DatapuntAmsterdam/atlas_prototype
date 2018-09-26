import { testSaga, expectSaga } from 'redux-saga-test-plan';

import watchFetchMapDetail, { fetchMapDetail } from './map-detail';
import * as fetchDetail from '../../services/map-detail';
import { fetchMapDetailFailure, FETCH_MAP_DETAIL_REQUEST, FETCH_MAP_DETAIL_SUCCESS } from '../../ducks/detail/map-detail';


describe('watchFetchMapDetail', () => {
  const action = { type: FETCH_MAP_DETAIL_REQUEST };

  it('should watch REQUEST_NEAREST_DETAILS and call fetchPanelLayers', () => {
    testSaga(watchFetchMapDetail)
      .next()
      .takeLatestEffect(FETCH_MAP_DETAIL_REQUEST, fetchMapDetail)
      .next(action)
      .isDone();
  });
});

describe('fetchNearestDetails', () => {
  const action = {
    endpoint: 'bag/ligplaats/',
    user: 'user'
  };
  fetchDetail.default = jest.fn();
  fetchDetail.default.mockImplementation(() => 'mapDetail');
  it('should call fetchMapDetail and dispatch the correct action', () => (
    expectSaga(fetchMapDetail, action)
      .put({
        type: FETCH_MAP_DETAIL_SUCCESS,
        endpoint: action.endpoint,
        mapDetail: 'mapDetail'
      })
      .run()
  ));

  it('should throw error and dispatch geosearch', () => {
    const error = new Error('My Error');
    testSaga(fetchMapDetail, action)
      .next()
      .throw(error)
      .put(fetchMapDetailFailure)
      .next()
      .isDone();
  });
});
