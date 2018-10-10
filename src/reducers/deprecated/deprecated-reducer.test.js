import reducer from './deprecated-reducer';
import * as environment from '../../shared/environment';
import * as homeReducer from '../home-reducers';
import * as DetailsReducer from '../details';
import * as DataSelectionReducer from '../data-selection-reducers';
import * as MapPreviewPanelReducer from '../../map/ducks/preview-panel/map-preview-panel';
import * as PageReducer from '../page-reducers';
import * as filtersReducers from './filters-reducers';
import * as MapSearchResultsReducer from '../../map/ducks/search-results/map-search-results';
import * as searchReducers from './search-reducers';
import * as deepFreeze from '../../shared/services/freeze/freeze';

const ACTION_NO_REDUCER = 'ACTION_NO_REDUCER';
const FREEZE = 'FREEZE';

describe('The deprecated reducer', () => {
  beforeEach(() => {
    deepFreeze.default = jest.fn((value) => value); // identity function
    environment.isDevelopment = () => false;
  });

  it('groups all separate reducers and calls the appropriate one depending on the action type', () => {
    const state = { foo: 'bar' };

    const actionC = jest.fn();
    const actionF = jest.fn();
    const actionG = jest.fn();
    const actionI = jest.fn();
    const actionL = jest.fn();

    DataSelectionReducer.default = { ACTION_I: actionI };
    DetailsReducer.default = {};
    filtersReducers.default = { ACTION_L: actionL };
    homeReducer.default = { ACTION_C: actionC };
    PageReducer.default = { ACTION_F: actionF };
    searchReducers.default = { ACTION_G: actionG };

    reducer(state, { type: 'ACTION_C' });
    reducer(state, { type: 'ACTION_F' });
    reducer(state, { type: 'ACTION_G' });
    reducer(state, { type: 'ACTION_I' });
    reducer(state, { type: 'ACTION_L' });

    expect(actionC.mock.calls[0])
      .toEqual([state, undefined]);
    expect(actionF.mock.calls[0])
      .toEqual([state, undefined]);
    expect(actionG.mock.calls[0])
      .toEqual([state, undefined]);
    expect(actionI.mock.calls[0])
      .toEqual([state, undefined]);
    expect(actionL.mock.calls[0])
      .toEqual([state, undefined]);
  });

  it('calls DetailsReducer', () => {
    const payload = { abc: 'xyz' };
    const state = { foo: 'bar' };

    DetailsReducer.default = jest.fn();
    reducer(state, { type: DetailsReducer.FETCH_DETAIL, payload });

    expect(DetailsReducer.default.mock.calls[0])
      .toEqual([state, { payload, type: DetailsReducer.FETCH_DETAIL }]);
  });

  it('calls MapSearchResultsReducer', () => {
    const state = { foo: 'bar' };
    const action = { type: MapSearchResultsReducer.FETCH_MAP_SEARCH_RESULTS_FAILURE };
    MapSearchResultsReducer.default = jest.fn();
    reducer(state, action);

    expect(MapSearchResultsReducer.default.mock.calls[0])
      .toEqual([state, action]);
  });

  it('calls MapPreviewPanelReducer', () => {
    const state = { foo: 'bar' };
    const action = { type: MapPreviewPanelReducer.OPEN_MAP_PREVIEW_PANEL };

    MapPreviewPanelReducer.default = jest.fn();
    reducer(state, action);

    expect(MapPreviewPanelReducer.default.mock.calls[0])
      .toEqual([state, action]);
  });


  it('returns the oldState if the specified action type has no separate reducer', () => {
    const state = { foo: 'bar' };
    // Note redux has some built-in action types that we can safely ignore.
    const output = reducer(state, { type: ACTION_NO_REDUCER });

    expect(output)
      .toBe(state);
  });

  it('deep freezes legacy state in development', () => {
    const state = { foo: 'bar' };
    DataSelectionReducer.default = { FREEZE: (s) => s };

    environment.isDevelopment = () => true;
    reducer(state, { type: FREEZE });

    expect(deepFreeze.default).toHaveBeenCalledWith(state);
  });

  it('should call reducer for Vanilla action types', () => {
    const state = { foo: 'bar' };
    const payload = { abc: 'xyz' };
    DetailsReducer.default = jest.fn();
    const action = { type: DetailsReducer.FETCH_DETAIL, payload };
    reducer(state, action);

    expect(DetailsReducer.default.mock.calls[0])
      .toEqual([state, action]);
  });

  it('deep freezes vanilla state in development', () => {
    const state = { foo: 'bar' };
    const payload = { abc: 'xyz' };
    DetailsReducer.default = () => state;
    environment.isDevelopment = () => true;
    const action = { type: DetailsReducer.FETCH_DETAIL, payload };

    reducer(state, action);

    expect(deepFreeze.default).toHaveBeenCalledWith(state);
  });
});
