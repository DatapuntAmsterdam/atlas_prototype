import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import {
  retrieveApiSpecification,
  retrieveDatasets
} from './dataset';
import {
  FETCH_API_SPECIFICATION_FAILURE,
  FETCH_API_SPECIFICATION_SUCCESS
} from '../../ducks/datasets/apiSpecification/apiSpecification';
import {
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS
} from '../../ducks/datasets/data/data';
import fetchApiSpecification from '../../services/datasets-filters/datasets-filters';
import { query } from '../../services/data-selection/data-selection-api';

describe('retrieveApiSpecification', () => {
  it('should dispatch the correct action', () => (
    expectSaga(retrieveApiSpecification)
      .provide({
        call(effect, next) {
          return effect.fn === fetchApiSpecification ? 'payload' : next();
        }
      })
      .put({
        type: FETCH_API_SPECIFICATION_SUCCESS,
        payload: 'payload'
      })
      .run()
  ));

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(retrieveApiSpecification)
      .next()
      .throw(error)
      .put({
        type: FETCH_API_SPECIFICATION_FAILURE,
        payload: error
      })
      .next()
      .isDone();
  });
});


describe('retrieveDatasets', () => {
  const mockPayload = {
    activeFilters: '',
    page: '',
    searchText: '',
    geometryFilter: ''
  };

  const mockResult = {
    data: [],
    filters: [],
    numberOfPages: 1,
    numberOfRecords: 1
  };

  const mockError = new Error('Cannot read property \'getState\' of undefined');

  it('should dispatch the correct action', () => (
    expectSaga(retrieveDatasets, { payload: mockPayload })
      .provide({
        call(effect, next) {
          return effect.fn === query ? mockResult : next();
        }
      })
      .put({
        type: FETCH_DATASETS_SUCCESS,
        payload: { ...mockPayload, result: mockResult },
        meta: {
          tracking: {
            query: mockPayload.searchText,
            numberOfResults: mockResult.numberOfRecords
          }
        }
      })
      .run()
  ));

  it('should dispatch the correct action', () => (
    expectSaga(retrieveDatasets, { payload: mockPayload })
      .provide(throwError(mockError.message))
      .put({
        type: FETCH_DATASETS_FAILURE,
        payload: { error: mockError.message }
      })
      .run()
  ));
});
