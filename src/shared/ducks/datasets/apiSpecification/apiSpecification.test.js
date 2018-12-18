import reducer, {
  FETCH_API_SPECIFICATION_FAILURE,
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS,
  fetchApiSpecification
} from './apiSpecification';

const initialState = {
  isLoading: false,
  error: null,
  data: {}
};
describe('data-selection-catalog reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_API_SPECIFICATION_REQUEST', () => {
    const startAction = {
      type: FETCH_API_SPECIFICATION_REQUEST
    };
    expect(reducer({}, startAction)).toEqual({
      isLoading: true,
      error: null
    });
  });

  it('should handle FETCH_API_SPECIFICATION_SUCCESS', () => {
    const successAction = {
      type: FETCH_API_SPECIFICATION_SUCCESS,
      payload: { items: [{ id: 1 }] }
    };
    expect(reducer({}, successAction)).toEqual({
      isLoading: false,
      error: null,
      data: { items: [{ id: 1 }] }
    });
  });

  it('should handle FETCH_API_SPECIFICATION_FAILURE', () => {
    const updateAction = {
      type: FETCH_API_SPECIFICATION_FAILURE,
      payload: 'Error'
    };
    expect(reducer({}, updateAction)).toEqual({
      error: 'Error',
      isLoading: false,
      data: {}
    });
  });
});

// ACTION CREATORS
describe('data-selection-catalog actions', () => {
  describe('fetchMapBaseLayers', () => {
    it('should create an action to request map baseLayers', () => {
      const expectedAction = {
        type: FETCH_API_SPECIFICATION_REQUEST
      };
      expect(fetchApiSpecification()).toEqual(expectedAction);
    });
  });
});
