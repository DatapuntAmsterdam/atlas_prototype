import { testSaga } from 'redux-saga-test-plan';
import watchMapDetail, { fetchDetailEffect, fetchMapDetail } from './map-detail';
import {
  fetchMapDetailFailure,
  fetchMapDetailSuccess, getMapDetail
} from '../../ducks/detail/map-detail';
import { closeMapPanel, mapLoadingAction } from '../../ducks/map/map';
import { FETCH_MAP_DETAIL_REQUEST } from '../../ducks/detail/constants';
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui';
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors';
import fetchLegacyDetail from '../../../detail/sagas/detail';

describe('watchFetchMapDetail', () => {
  const action = { type: FETCH_MAP_DETAIL_REQUEST };

  it('should watch FETCH_MAP_DETAIL_REQUEST and call fetchMapDetail', () => {
    testSaga(watchMapDetail)
      .next()
      .takeLatestEffect(FETCH_MAP_DETAIL_REQUEST, fetchMapDetail)
      .next(action)
      .next()
      .isDone();
  });
});

describe('fetchDetailEffect', () => {
  it('should close the map panel if not on MAP view', () => {
    testSaga(fetchDetailEffect)
      .next()
      .select(getViewMode)
      .next(VIEW_MODE.SPLIT)
      .put(closeMapPanel())
      .next()
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .call(fetchLegacyDetail)
      .next()
      .isDone();

    testSaga(fetchDetailEffect)
      .next()
      .select(getViewMode)
      .next(VIEW_MODE.MAP)
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .call(fetchLegacyDetail)
      .next()
      .isDone();
  });
});

describe('fetchNearestDetails', () => {
  const action = {
    endpoint: 'bag/ligplaats/',
    user: 'user'
  };

  it('should call fetchMapDetail and dispatch the correct action', () => {
    testSaga(fetchMapDetail)
      .next()
      .next()
      .next()
      .next(action.endpoint)
      .next('mapDetail')
      .put(fetchMapDetailSuccess(action.endpoint, 'mapDetail'))
      .next()
      .put(mapLoadingAction(false))
      .next()
      .isDone();
  });

  it('should throw error and dispatch geosearch', () => {
    const error = new Error('My Error');
    testSaga(fetchMapDetail, action)
      .next()
      .throw(error)
      .put(fetchMapDetailFailure(error))
      .next()
      .put(mapLoadingAction(false))
      .next()
      .isDone();
  });
});
