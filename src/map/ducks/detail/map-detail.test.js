import reducer, {
  fetchMapDetailFailure,
  fetchMapDetailSuccess,
  getAllResults,
  getCurrentEndpoint,
  getDetailId,
  getGeoJson,
  getGeometry,
  getMapDetail,
  getMapDetailGeometry,
  selectLatestMapDetail
} from './map-detail';
import { FETCH_MAP_DETAIL_SUCCESS, FETCH_MAP_DETAIL_FAILURE } from './constants';

// REDUCER
describe('reducer', () => {
  const initialState = {
    byEndpoint: {},
    isLoading: false,
    currentEndpoint: '',
    error: ''
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_MAP_DETAIL_REQUEST', () => {
    expect(reducer(initialState, getMapDetail('123'))).toEqual({
      byEndpoint: {},
      currentEndpoint: '123',
      isLoading: true,
      error: ''
    });
  });

  it('should handle FETCH_MAP_DETAIL_SUCCESS', () => {
    const startAction = {
      type: FETCH_MAP_DETAIL_SUCCESS,
      endpoint: '123',
      mapDetail: {
        id: '123'
      }
    };
    const retrievingMapDetailState = {
      byEndpoint: {
        456: {
          id: '456'
        }
      },
      error: '',
      currentEndpoint: startAction.endpoint,
      isLoading: true
    };
    expect(reducer(retrievingMapDetailState, startAction)).toEqual({
      ...retrievingMapDetailState,
      byEndpoint: {
        ...retrievingMapDetailState.byEndpoint,
        [startAction.endpoint]: startAction.mapDetail
      },
      isLoading: false
    });
  });

  it('should handle FETCH_MAP_DETAIL_FAILURE', () => {
    const startAction = {
      type: FETCH_MAP_DETAIL_FAILURE,
      error: 'error message'
    };
    const retrievingMapDetailState = {
      byEndpoint: {},
      currentEndpoint: '123',
      isLoading: true
    };
    expect(reducer(retrievingMapDetailState, startAction)).toEqual({
      ...retrievingMapDetailState,
      isLoading: false,
      error: startAction.error
    });
  });
});

// SELECTORS
describe('selectors', () => {
  const mockParameters = {
    mapDetail: {
      currentEndpoint: '123',
      byEndpoint: {
        123: {
          geometrie: {}
        },
        456: {}
      }
    },
    detail: {
      geometry: {},
      endpoint: '123'
    }
  };
  describe('getCurrentEndpoint', () => {
    it('should return the current endpoint', () => {
      const { currentEndpoint } = mockParameters.mapDetail;
      const selected = getCurrentEndpoint.resultFunc(mockParameters.mapDetail);
      expect(selected).toEqual(currentEndpoint);
    });
  });

  describe('getAllResults', () => {
    it('should return all the byEndpoint details', () => {
      const { byEndpoint } = mockParameters.mapDetail;
      const selected = getAllResults.resultFunc(mockParameters.mapDetail);
      expect(selected).toEqual(byEndpoint);
    });
  });

  describe('getDetailId', () => {
    it('should return the endpoint from mapDetail', () => {
      const { currentEndpoint } = mockParameters.mapDetail;
      const selected = getDetailId(mockParameters);
      expect(selected).toEqual(currentEndpoint);
    });

    it('should return the endpoint from details', () => {
      const { endpoint } = mockParameters.detail;
      const selected = getDetailId(mockParameters);
      expect(selected).toEqual(endpoint);
    });
  });

  describe('selectLatestMapDetail', () => {
    it('should return the active mapDetail results', () => {
      const { currentEndpoint, byEndpoint } = mockParameters.mapDetail;
      const selected = selectLatestMapDetail.resultFunc(currentEndpoint, byEndpoint);
      expect(selected).toEqual(byEndpoint[currentEndpoint]);
    });

    it('should return empty string if currentEndpoint is empty', () => {
      const { byEndpoint } = mockParameters.mapDetail;
      const selected = selectLatestMapDetail.resultFunc('', byEndpoint);
      expect(selected).toEqual('');
    });

    it('should return empty string if byEndpoint is empty', () => {
      const { currentEndpoint } = mockParameters.mapDetail;
      const selected = selectLatestMapDetail.resultFunc(currentEndpoint, '');
      expect(selected).toEqual('');
    });
  });

  describe('getMapDetailGeometry', () => {
    it('should return the active mapDetail geometrie', () => {
      const { currentEndpoint, byEndpoint } = mockParameters.mapDetail;
      const selected = getMapDetailGeometry.resultFunc(byEndpoint[currentEndpoint]);
      expect(selected).toEqual(byEndpoint[currentEndpoint].geometrie);
    });

    it('should return empty string if there is no active mapDetail', () => {
      const selected = getMapDetailGeometry.resultFunc('');
      expect(selected).toEqual('');
    });
  });

  describe.skip('getGeometry', () => { // TODO: refactor, remove or test
    it('should return geometry from detail', () => {
      const { currentEndpoint, byEndpoint } = mockParameters.mapDetail;
      const selected = getGeometry.resultFunc(
        mockParameters.detail.geometry,
        byEndpoint[currentEndpoint]
      );
      expect(selected).toEqual(mockParameters.detail.geometry);
    });

    it('should return geometrie from the active mapDetail', () => {
      const { currentEndpoint, byEndpoint } = mockParameters.mapDetail;
      const selected = getGeometry.resultFunc({}, byEndpoint[currentEndpoint].geometrie);
      expect(selected).toEqual(byEndpoint[currentEndpoint].geometrie);
    });

    it('should return an empty string if there is no geometry', () => {
      const selected = getGeometry.resultFunc('', '');
      expect(selected).toEqual('');
    });
  });

  describe('getGeoJson', () => {
    const geometry = { id: '1' };
    const detail = { display: 'label' };
    it('should return empty object if geoJson should not be shown', () => {
      const selected = getGeoJson.resultFunc(false, geometry, detail, 'detailId');
      expect(selected).toEqual({});
    });

    it('should return empty object if geometry is empty', () => {
      const selected = getGeoJson.resultFunc(true, '', detail, 'detailId');
      expect(selected).toEqual({});
    });

    it('should return a geoJson object', () => {
      const selected = getGeoJson.resultFunc(true, geometry, detail.display, 'detailId');
      expect(selected).toEqual({
        id: 'detailId',
        geoJson: {
          geometry,
          label: detail.display
        }
      });
    });

    it('should return a geoJson object with a empty string if detail.display is undefined', () => {
      const selected = getGeoJson.resultFunc(true, geometry, '', 'detailId');
      expect(selected).toEqual({
        id: 'detailId',
        geoJson: {
          geometry,
          label: ''
        }
      });
    });
  });
});

// ACTION CREATORS
describe('actions', () => {
  describe('fetchMapDetailFailure', () => {
    it('should create an action if requests fails', () => {
      const expectedAction = {
        type: FETCH_MAP_DETAIL_FAILURE,
        error: 'error message'
      };
      expect(fetchMapDetailFailure('error message')).toEqual(expectedAction);
    });
  });

  describe('fetchMapDetailSuccess', () => {
    it('should create an action if requests is done', () => {
      const expectedAction = {
        type: FETCH_MAP_DETAIL_SUCCESS,
        endpoint: '123',
        mapDetail: {
          id: 123
        }
      };
      const action = fetchMapDetailSuccess(expectedAction.endpoint, expectedAction.mapDetail);
      expect(action).toEqual(expectedAction);
    });
  });
});
