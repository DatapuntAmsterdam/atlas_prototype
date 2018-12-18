import { expectSaga, testSaga } from 'redux-saga-test-plan';

import watchFetchNearestDetails, { fetchNearestDetails } from './nearest-details';

import fetchNearestDetail from '../../services/nearest-detail/nearest-detail';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { setGeoLocation } from '../../../shared/ducks/data-search/actions';

describe('watchFetchNearestDetails', () => {
  const action = { type: REQUEST_NEAREST_DETAILS };

  it('should watch REQUEST_NEAREST_DETAILS and call fetchPanelLayers', () => {
    testSaga(watchFetchNearestDetails)
      .next()
      .takeLatestEffect(REQUEST_NEAREST_DETAILS, fetchNearestDetails)
      .next(action)
      .next()
      .isDone();
  });
});

describe('fetchNearestDetails', () => {
  const action = {
    payload: {
      location: {
        latitude: 2,
        longitude: 1
      },
      layers: [],
      zoom: 12
    }
  };
  it('should call fetchNearestDetails and dispatch the correct actions if uri is returned', () => (
    expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return { uri: 'uri', id: '123' };
          }
          return next();
        }
      })
      .put(setGeoLocation(action.payload.location))
      .run()
  ));

  it('should call fetchNearestDetails and dispatch setGeolocation', () => (
    expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return '';
          }
          return next();
        }
      })
      .put(setGeoLocation(action.payload.location))
      .run()
  ));

  it('should throw error and dispatch setGeolocation', () => {
    const error = new Error('My Error');
    testSaga(fetchNearestDetails, action)
      .next()
      .throw(error)
      .put(setGeoLocation(action.payload.location))
      .next()
      .isDone();
  });
});
