import { testSaga } from 'redux-saga-test-plan';
import {
  fetchMapSearchResultsFailure, fetchMapSearchResultsSuccessList,
  fetchMapSearchResultsSuccessPanel
} from '../../ducks/data-search/actions';
import { fetchMapSearchResults } from './data-search';
import search from '../../../map/services/map-search/map-search';
import geosearch from '../../services/search/geosearch';

describe('fetchMapSearchResults', () => {
  it('should do a location search', () => {
    testSaga(fetchMapSearchResults, {})
      .next()
      .next(12) // zoom
      .next(true) // isMap
      .next(true) // isMapActive
      .next(true) // isDataSearch
      .next('location')
      .next()
      .next()
      .next('user')
      .call(search, 'location', 'user')
      .next('results')
      .put(fetchMapSearchResultsSuccessPanel('results'))
      .next()
      .isDone();
  });

  it('should do a geolocation search', () => {
    testSaga(fetchMapSearchResults, {})
      .next()
      .next(12) // zoom
      .next(false) // isMap
      .next(false) // isMapActive
      .next(true) // isDataSearch
      .next('location')
      .next()
      .next()
      .next('user')
      .call(geosearch, 'location', 'user')
      .next([])
      .put(fetchMapSearchResultsSuccessList([], 0))
      .next()
      .isDone();
  });

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(fetchMapSearchResults, {})
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .throw(error)
      .put(fetchMapSearchResultsFailure(''))
      .next()
      .isDone();
  });
});
