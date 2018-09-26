import reducer, {
  DETAIL_FULLSCREEN,
  FETCH_DETAIL,
  SHOW_DETAIL,
  fetchDetail
} from './details';

const initialState = {
  error: null,
  location: {},
  previews: {}
};

const stateAfterRequest = {
  map: {
    some: 'data'
  },
  detail: {
    some: 'data'
  }
};

describe('DetailReducerReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it(`should set the location when ${FETCH_DETAIL} is dispatched`, () => {
    expect(reducer(initialState, {
      type: FETCH_DETAIL,
      payload: 'payload'
    })).toEqual({
      dataSelection: null,
      detail: {
        endpoint: 'payload',
        reload: false,
        isLoading: true,
        isFullscreen: false,
        skippedSearchResults: false
      },
      map: {
        isLoading: true
      },
      page: {
        name: null,
        type: null
      },
      previews: {},
      error: null,
      location: {},
      search: null,
      straatbeeld: null,
      ui: {
        isMapFullscreen: false
      }
    });
  });

  it(`should set the detail data when ${SHOW_DETAIL} is dispatched`, () => {
    expect(reducer(stateAfterRequest, {
      type: SHOW_DETAIL,
      payload: {
        display: 'display',
        geometry: 'geometry'
      }
    })).toEqual({
      detail: {
        some: 'data',
        display: 'display',
        geometry: 'geometry',
        isLoading: false,
        reload: false
      },
      map: {
        some: 'data',
        isLoading: false
      }
    });
  });

  it(`should set the previews when ${DETAIL_FULLSCREEN} is dispatched`, () => {
    expect(reducer(stateAfterRequest, {
      type: DETAIL_FULLSCREEN,
      payload: true
    })).toEqual({
      detail: {
        some: 'data',
        isFullscreen: true
      },
      map: {
        some: 'data'
      }
    });
  });
});

describe('fetchDetail method', () => {
  it('should return an object with action type and payload containing an endpoint', () => {
    expect(fetchDetail('endpoint')).toEqual({
      type: FETCH_DETAIL,
      payload: 'endpoint'
    });
  });
});
