import reducer, {
  REDUCER_KEY,
  SELECTION_TYPE,
  initialState,
  SET_SELECTION,
  CLEAR_SELECTION,
  previewDataAvailable,
  getSelectionType,
  isGeoSearch
} from './selection';
import { routing } from '../../../app/routes';
import { SET_GEOMETRY_FILTERS } from '../data-selection/constants';

describe('selection Reducer', () => {
  let state;

  beforeEach(() => {
    state = reducer(undefined, {});
  });

  it('should set the initial state', () => {
    expect(state).toEqual(initialState);
  });

  describe('route changes', () => {
    it('should handle the routing.dataDetail.type', () => {
      expect(reducer(state, { type: routing.dataDetail.type })).toEqual({
        type: SELECTION_TYPE.OBJECT
      });
    });

    it('should handle the routing.panorama.type', () => {
      const payload = { id: 'payload' };
      const action = { type: routing.panorama.type, payload };

      expect(reducer(state, action)).toEqual({
        type: SELECTION_TYPE.PANORAMA,
        id: action.payload.id
      });
    });

    it('should handle the routing.home.type', () => {
      const action = { type: routing.home.type };

      expect(reducer(state, action)).toEqual(initialState);
    });
  });

  it('should handle the SET_GEOMETRY_FILTERS', () => {
    const action = { type: SET_GEOMETRY_FILTERS };

    expect(reducer(state, action)).toEqual(initialState);
  });

  it('should handle the SET_SELECTION', () => {
    const payload = { selection: 'selection' };
    const action = { type: SET_SELECTION, payload };

    expect(reducer(state, action)).toEqual({ type: payload });
  });

  it('should handle the CLEAR_SELECTION', () => {
    const action = { type: CLEAR_SELECTION };

    expect(reducer(state, action)).toEqual(initialState);
  });
});

describe('selection selectors', () => {
  it('previewDataAvailable', () => {
    const state = {
      [REDUCER_KEY]: {
        type: SELECTION_TYPE.OBJECT
      }
    };
    expect(previewDataAvailable(state)).toEqual(true);
  });

  it('getSelectionType', () => {
    const state = {
      [REDUCER_KEY]: {
        type: SELECTION_TYPE.OBJECT
      }
    };
    expect(getSelectionType(state)).toEqual(SELECTION_TYPE.OBJECT);
  });

  it('isGeoSearch', () => {
    const state = {
      [REDUCER_KEY]: {
        type: SELECTION_TYPE.POINT
      }
    };
    expect(isGeoSearch(state)).toEqual(true);
  });
});
