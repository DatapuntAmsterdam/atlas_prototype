import {
  getDatasetsData,
  getAuthError,
  getResults,
  getFilters,
  getPage,
  getSearchText,
  getNumberOfResults,
  getApiSpecification,
  getApiSpecificationData,
  DATASETS
} from './datasets';
import { DATA } from './data/data';
import { API_SPECIFICATION } from './apiSpecification/apiSpecification';

describe('datasets selectors', () => {
  const state = {
    [DATASETS]: {
      [DATA]: {
        authError: false,
        searchText: 'foo',
        page: 1,
        result: {
          filters: 'value',
          numberOfRecords: 1
        }
      },
      [API_SPECIFICATION]: {
        data: 'foo'
      }
    }
  };

  it('should get dataset data selectors', () => {
    expect(getDatasetsData(state)).toEqual(state[DATASETS][DATA]);
    expect(getAuthError(state)).toEqual(state[DATASETS][DATA].authError);
    expect(getPage(state)).toEqual(state[DATASETS][DATA].page);
    expect(getResults(state)).toEqual(state[DATASETS][DATA].result);
    expect(getSearchText(state)).toEqual(state[DATASETS][DATA].searchText);
    expect(getFilters(state)).toEqual(state[DATASETS][DATA].result.filters);
    expect(getNumberOfResults(state)).toEqual(state[DATASETS][DATA].result.numberOfRecords);
  });

  it('should get dataset apiSpecification selectors', () => {
    expect(getApiSpecification(state)).toEqual(state[DATASETS][API_SPECIFICATION]);
    expect(getApiSpecificationData(state)).toEqual(state[DATASETS][API_SPECIFICATION].data);
  });
});
